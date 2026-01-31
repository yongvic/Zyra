import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Import PrismaService
import { ChatMessage } from '@prisma/client'; // Import ChatMessage model type

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {} // Inject PrismaService

  async saveMessage(
    coupleId: string,
    senderId: string,
    content: string, // Renamed 'message' to 'content' to match Prisma schema
    messageType: string = 'text',
  ): Promise<ChatMessage> {
    return this.prisma.chatMessage.create({
      data: {
        coupleId: coupleId,
        senderId: senderId,
        content: content,
        messageType: messageType,
      },
    });
  }

  async getMessages(coupleId: string, limit: number = 50): Promise<ChatMessage[]> {
    const messages = await this.prisma.chatMessage.findMany({
      where: { coupleId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return messages.reverse();
  }

  async deleteMessage(messageId: string): Promise<ChatMessage> {
    return this.prisma.chatMessage.delete({
      where: { id: messageId },
    });
  }
}
