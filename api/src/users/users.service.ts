import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async createOne(email: string, password: string) {
    return this.userRepository.save(
      this.userRepository.create({ name: '', email, password }),
    );
  }

  async updateOne(email: string, name: string) {
    const user = await this.findOne(email);
    if (user) {
      await this.userRepository.update({ email }, { name });
      return { message: 'User name updated successfully!' };
    } else {
      throw new NotFoundException('User not found!');
    }
  }
}
