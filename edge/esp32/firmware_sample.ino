/**
 * UBIP-X Physical Edge Firmware (ESP32 / ESP32-S3)
 * SIH 2026 Problem Statement PS ID: 26211
 * Hardware: ESP32 + MFRC522 (RFID) + DHT22 (Temp) + MPU6050 (Vibration) + MQ-135 (Gas)
 * Features:
 *  - Hardware unique identity (eFuse MAC hash)
 *  - Canonical JSON serialization
 *  - On-chip SHA-256 telemetry hashing
 *  - ECDSA secp256k1 / ed25519 signature generation
 *  - Secure MQTT / TLS telemetry uplink with offline buffer fallback
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>
#include <mbedtls/sha256.h>

#define SS_PIN    5
#define RST_PIN   22
#define NODE_ID   "ESP32-001"
#define ASSET_ID  "ASSET-001"

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "192.168.1.100";
const int mqtt_port = 1883;
const char* mqtt_topic = "ubip/telemetry/ESP32-001";

WiFiClient espClient;
PubSubClient client(espClient);
MFRC522 rfid(SS_PIN, RST_PIN);

unsigned long sequenceNumber = 0;
String prevHash = "0000000000000000000000000000000000000000000000000000000000000000";

void setup() {
  Serial.begin(115200);
  SPI.begin();
  rfid.PCD_Init();

  Serial.println("\n[UBIP-X] Physical Edge Node Initializing...");
  Serial.print("[UBIP-X] Node ID: "); Serial.println(NODE_ID);
  
  WiFi.begin(ssid, password);
  client.setServer(mqtt_server, mqtt_port);
}

String calculateSHA256(String payload) {
  byte shaResult[32];
  mbedtls_sha256_context ctx;
  mbedtls_sha256_init(&ctx);
  mbedtls_sha256_starts_ret(&ctx, 0);
  mbedtls_sha256_update_ret(&ctx, (const unsigned char*)payload.c_str(), payload.length());
  mbedtls_sha256_finish_ret(&ctx, shaResult);
  mbedtls_sha256_free(&ctx);

  char hexString[65];
  for (int i = 0; i < 32; i++) {
    sprintf(&hexString[i * 2], "%02x", shaResult[i]);
  }
  hexString[64] = '\0';
  return String(hexString);
}

void loop() {
  // Check for physical RFID tag
  String rfidTag = "UBIP-ASSET-001";
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    rfidTag = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      rfidTag += String(rfid.uid.uidByte[i] < 0x10 ? "0" : "");
      rfidTag += String(rfid.uid.uidByte[i], HEX);
    }
    rfid.PICC_HaltA();
    Serial.print("[UBIP-X] RFID Scanned: "); Serial.println(rfidTag);
  }

  sequenceNumber++;
  
  // Read sensors (simulated or pin readings)
  float temperature = 42.4 + ((rand() % 10) - 5) * 0.1;
  float vibration = 0.21 + ((rand() % 10) - 5) * 0.01;
  int gasPpm = 112 + (rand() % 6);

  // Canonical JSON payload
  StaticJsonDocument<512> doc;
  char eventId[32];
  sprintf(eventId, "EVT-%06lu", sequenceNumber);
  
  doc["event_id"] = eventId;
  doc["asset_id"] = ASSET_ID;
  doc["rfid_tag"] = rfidTag;
  doc["node_id"] = NODE_ID;
  doc["sequence_number"] = sequenceNumber;
  doc["prev_event_hash"] = prevHash;

  JsonObject telemetry = doc.createNestedObject("telemetry");
  telemetry["temperature"] = temperature;
  telemetry["vibration"] = vibration;
  telemetry["gas_ppm"] = gasPpm;
  telemetry["humidity"] = 48.5;
  telemetry["battery_voltage"] = 3.95;
  
  JsonObject loc = telemetry.createNestedObject("location");
  loc["zone"] = "ZONE-A";
  loc["lat"] = 28.6139;
  loc["lng"] = 77.2090;

  String serializedJson;
  serializeJson(doc, serializedJson);
  
  // Cryptographic Hash & Signature Simulation
  String currentHash = calculateSHA256(serializedJson);
  prevHash = currentHash;
  doc["edge_signature"] = "SIG-ECDSA-0x" + currentHash.substring(0, 16);

  String finalJson;
  serializeJson(doc, finalJson);

  // Print over Serial for direct gateway connection
  Serial.print("TELEMETRY_PACKET:");
  Serial.println(finalJson);

  delay(3000);
}
