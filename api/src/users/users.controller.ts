import { BadRequestException, Body, Controller, Get, Post, Put, UnauthorizedException } from '@nestjs/common';
import { UserDto } from './dtos/users.dto';
import { ChangeUserNameDto } from './dtos/change-user-name.dto';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}
  
  @Post('signup') async signUp(@Body() user: UserDto) {
    return await this.authService.createUser(user.email, user.password);
  }

  @Post('signin') async signIn(@Body() user: UserDto) {
    return await this.authService.authUser(user.email, user.password);
  }

  @Get() async getUsers() {
    const res =  await this.usersService.findAll();
    return { message: res };
  }

  @Put() changeName(@Body() user: ChangeUserNameDto) {
    
  }
}
