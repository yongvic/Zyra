import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':coupleId/messages')
  async getMessages(@Param('coupleId') coupleId: string) {
    return this.chatService.getMessages(coupleId);
  }
}
