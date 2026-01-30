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
  server: Server;

  private userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.userSockets.delete(client.id);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, data: { coupleId: string; userId: string }) {
    const room = `couple_${data.coupleId}`;
    client.join(room);

    if (!this.userSockets.has(data.userId)) {
      this.userSockets.set(data.userId, new Set());
    }
    this.userSockets.get(data.userId)?.add(client.id);

    this.server.to(room).emit('user_joined', {
      userId: data.userId,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    data: { coupleId: string; senderId: string; message: string },
  ) {
    const savedMessage = await this.chatService.saveMessage(
      data.coupleId,
      data.senderId,
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
    this.userSockets.get(data.userId)?.delete(client.id);

    this.server.to(room).emit('user_left', {
      userId: data.userId,
      timestamp: new Date(),
    });
  }
}
