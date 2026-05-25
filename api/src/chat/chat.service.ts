import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../database/message.entity';
import { User } from '../database/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async saveDirectMessage(text: string, senderId: number, receiverId: number) {
    const sender = await this.userRepository.findOneBy({ id: senderId });
    const receiver = await this.userRepository.findOneBy({ id: receiverId });

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or receiver not found');
    }

    const message = this.messageRepository.create({
      text,
      sender,
      receiver,
    });

    return this.messageRepository.save(message);
  }

  async getChatHistory(currentUserId: number, targetUserId: number) {
    return this.messageRepository.find({
      where: [
        { sender: { id: currentUserId }, receiver: { id: targetUserId } },
        { sender: { id: targetUserId }, receiver: { id: currentUserId } },
      ],
      relations: {
        sender: true,
        receiver: true,
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        sender: {
          id: true,
          name: true,
          email: true,
        },
        receiver: {
          id: true,
          name: true,
          email: true,
        },
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }
}
