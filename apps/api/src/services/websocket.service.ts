import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import * as OutputSchema from '@/types/ws';
let wss: WebSocketServer;

export const initWebSocket = (server: Server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (socket: WebSocket) => {
    console.log('A new client joined');
    socket.on('close', () => {
      console.log('Client disconnected.');
    });
  });
};

export const broadcastNewPost = (postData: OutputSchema.PopulatedPost) => {
  console.log(`Broadcasting post from ${postData.author.name}`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: 'NEW_POST',
          payload: postData,
        })
      );
    }
  });
};

export const broadcastDeletePost = (postId: string) => {
  console.log(`Broadcasting deleted post from ${postId}`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: 'DELETE_POST',
          payload: {
            postId: postId,
          },
        })
      );
    }
  });
};
