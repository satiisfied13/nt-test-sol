import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../database/message.entity';
import { Repository } from 'typeorm';
import { User } from '../database/user.entity';
import { NotFoundException } from '@nestjs/common';

export class ChatService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async saveMessage(text: string, userId: number) {
    const sender = await this.userRepository.findOneBy({ id: userId });

    if (!sender) {
      throw new NotFoundException(`User not found!`);
    }

    const message = this.messageRepository.create({
      text: text,
      sender: sender,
    });

    return this.messageRepository.save(message);
  }

  async getMessages() {
    return this.messageRepository.find({
      relations: { sender: true },
      order: { createdAt: 'ASC' },
      take: 50,
    });
  }
}
