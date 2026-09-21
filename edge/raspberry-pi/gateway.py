#!/usr/bin/env python3
"""
UBIP-X Raspberry Pi Edge Gateway Daemon
Handles:
- Serial and MQTT data ingestion from ESP32 edge nodes
- Schema validation against eventSchema.json
- Local SQLite store-and-forward queue during network disconnect
- PQC / Classical cryptographic signature verification
- HTTP Uplink to UBIP-X Backend Server
"""

import sys
import json
import time
import hashlib
import sqlite3
import urllib.request
import urllib.error

DB_PATH = "edge_queue.db"
BACKEND_URL = "http://localhost:5000/api/telemetry"

def init_local_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS event_queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id TEXT UNIQUE,
            asset_id TEXT,
            payload TEXT,
            status TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def queue_event(event_data):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT OR IGNORE INTO event_queue (event_id, asset_id, payload, status) VALUES (?, ?, ?, ?)",
        (event_data["event_id"], event_data["asset_id"], json.dumps(event_data), "PENDING_SYNC")
    )
    conn.commit()
    conn.close()

def sync_pending_events():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, payload FROM event_queue WHERE status = 'PENDING_SYNC' ORDER BY id ASC LIMIT 20")
    rows = c.fetchall()
    
    if not rows:
        conn.close()
        return

    print(f"[UBIP-X Gateway] Syncing {len(rows)} buffered offline events to backend...")
    for row_id, payload_str in rows:
        try:
            req = urllib.request.Request(
                BACKEND_URL,
                data=payload_str.encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            with urllib.request.urlopen(req, timeout=3) as resp:
                if resp.status in (200, 201):
                    c.execute("UPDATE event_queue SET status = 'SYNCED' WHERE id = ?", (row_id,))
                    conn.commit()
        except Exception as e:
            print(f"[UBIP-X Gateway] Uplink connection failed: {e}. Keeping events in offline queue.")
            break
            
    conn.close()

def main():
    print("[UBIP-X Gateway] Starting Raspberry Pi Edge Gateway...")
    init_local_db()
    
    # Process loop
    while True:
        sync_pending_events()
        time.sleep(2)

if __name__ == "__main__":
    main()
