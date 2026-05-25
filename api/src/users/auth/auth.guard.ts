import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.cookies?.['jwt'] as string;

    if (!token) {
      throw new UnauthorizedException('Authentication cookie not found');
    }

    try {
      const u: Token = await this.jwtService.verifyAsync(token, {
        secret: 'MY_SUPER_SECRET_KEY',
      });
      request['token'] = u;
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }

    return true;
  }
}

export interface Token {
  sub: number;
  email: string;
  exp: number;
  iat: number;
}
