import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/user.entity';
import { Message } from '../database/message.entity';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [TypeOrmModule.forFeature([User, Message])],
})
export class ChatModule {}
