import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async createUser(email: string, password: string) {
        const existingUser = await this.usersService.findOne(email);
        if (existingUser) {
            throw new ConflictException('Email already in use'); 
        }
        const hashedPass = await bcrypt.hash(password, 10);
        await this.usersService.createOne(email, hashedPass);
        return { message: 'User created successfully' };
    }

    async authUser(email, password) {
        const user = await this.usersService.findOne(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordMatching = await bcrypt.compare(password, user.password);
        if (!isPasswordMatching) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return { message: 'Authorized successfully!' };
    }
}