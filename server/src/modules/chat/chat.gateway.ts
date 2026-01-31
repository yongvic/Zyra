import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  handleConnection(client: Socket) {
    const token =
      (client.handshake.auth?.token as string | undefined) ||
      (typeof client.handshake.headers.authorization === 'string'
        ? client.handshake.headers.authorization.replace(/^Bearer\s+/i, '')
        : undefined);

    if (!token) {
      client.disconnect(true);
      return;
    }

    const decoded = this.authService.validateToken(token);
    if (!decoded) {
      client.disconnect(true);
      return;
    }

    // Attach authenticated user id to the socket (prevents spoofing via client payloads)
    (client.data as any).userId = decoded.sub;

    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    for (const [userId, sockets] of this.userSockets.entries()) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, data: { coupleId: string; userId: string }) {
    const room = `couple_${data.coupleId}`;
    client.join(room);

    const userId = (client.data as any).userId || data.userId;

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)?.add(client.id);

    this.server.to(room).emit('user_joined', {
      userId,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    data: { coupleId: string; senderId: string; message: string },
  ) {
    const senderId = (client.data as any).userId || data.senderId;
    const savedMessage = await this.chatService.saveMessage(
      data.coupleId,
      senderId,
      data.message,
      'text',
    );

    const room = `couple_${data.coupleId}`;
    this.server.to(room).emit('message', savedMessage);
  }

  @SubscribeMessage('typing')
  handleTyping(
    client: Socket,
    data: { coupleId: string; userId: string; isTyping: boolean },
  ) {
    const room = `couple_${data.coupleId}`;
    this.server.to(room).emit('user_typing', {
      userId: data.userId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('leave')
  handleLeave(client: Socket, data: { coupleId: string; userId: string }) {
    const room = `couple_${data.coupleId}`;
    client.leave(room);
    const userId = (client.data as any).userId || data.userId;
    this.userSockets.get(userId)?.delete(client.id);

    this.server.to(room).emit('user_left', {
      userId,
      timestamp: new Date(),
    });
  }
}
