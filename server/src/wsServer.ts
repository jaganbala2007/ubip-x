import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { hardwareManager } from './services/hardwareManager.js';

export function setupWebSocketServer(server: HttpServer) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws: WebSocket) => {
    clients.add(ws);
    
    // Send initial welcome message
    ws.send(JSON.stringify({
      type: 'CONNECTED',
      message: 'UBIP-X Real-Time Trust Stream Initialized',
      timestamp: new Date().toISOString()
    }));

    ws.on('message', (message: string) => {
      try {
        const parsed = JSON.parse(message.toString());
        if (parsed.type === 'SCENARIO_TRIGGER') {
          hardwareManager.triggerScenarioEvent(parsed.scenario);
        }
      } catch (err) {
        console.error('[UBIP-X WS] Error parsing client message:', err);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
    });

    ws.on('error', () => {
      clients.delete(ws);
    });
  });

  // Attach broadcaster to hardware manager
  hardwareManager.setBroadcaster((type: string, data: any) => {
    const payload = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  });

  return wss;
}
