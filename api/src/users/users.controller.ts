import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Res,
  Req,
  UseGuards, UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { AuthService } from './auth/auth.service';
import { UsersService } from './users.service';
import { UserDto } from './dtos/users.dto';
import { AuthGuard, Token } from './auth/auth.guard';
import { ChangeUserNameDto } from './dtos/change-user-name.dto';

@Controller('user')
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async signIn(
    @Body() user: UserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.authUser(user.email, user.password);

    res.cookie('jwt', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      email: result.email,
      name: result.name,
      id: result.id,
    };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req: Request & { token: Token }) {
    const user = await this.usersService.findOne(req.token.email);
    if (user) {
      return {
        email: user.email,
        name: user.name,
        id: user.id,
      };
    } else {
      throw new UnauthorizedException('Not Authorized!');
    }
  }

  @UseGuards(AuthGuard)
  @Put('name')
  async changeName(
    @Body() body: ChangeUserNameDto,
    @Req() req: Request & { token: Token },
  ) {
    const userEmail = req.token.email;
    return await this.usersService.updateOne(userEmail, body.name);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Logged out successfully' };
  }
}
