import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private generateToken(userId: number, email: string) {
    const payload = { sub: userId, email: email };
    return this.jwtService.sign(payload);
  }

  async createUser(email: string, password: string) {
    const hashedPass = await bcrypt.hash(password, 10);
    const createdUser = await this.usersService.createOne(email, hashedPass);
    const token = this.generateToken(createdUser.id, createdUser.email);
    return {
      email: createdUser.email,
      name: createdUser.name,
      id: createdUser.id,
      token: token,
    };
  }

  async authUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      return this.createUser(email, password);
    }
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.generateToken(user.id, user.email);
    return {
      email: user.email,
      name: user.name,
      id: user.id,
      token: token,
    };
  }
}
