import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { AuthGuard, Token } from '../users/auth/auth.guard';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('history/:targetUserId')
  async getHistory(
    @Param('targetUserId') targetUserId: string,
    @Req() req: Request & { token: Token },
  ) {
    const myUserId = req.token.sub;

    return this.chatService.getChatHistory(
      myUserId,
      parseInt(targetUserId, 10),
    );
  }
}
