import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as cookie from 'cookie';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { Token } from '../users/auth/auth.guard';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const cookies = cookie.parse(client.handshake.headers.cookie || '');
      const token = cookies['jwt'];

      if (!token) {
        throw new Error('No token');
      }

      const payload: Token = await this.jwtService.verifyAsync(token, {
        secret: 'MY_SUPER_SECRET_KEY',
      });
      const userId = payload.sub;

      client.join(`user_${userId}`);
      console.log(`User ${userId} connected and joined room: user_${userId}`);

      client.data.userId = userId;
    } catch {
      console.log('WebSocket Authentication failed');
      client.disconnect();
    }
  }

  @SubscribeMessage('sendDirectMessage')
  async handleDirectMessage(
    @MessageBody() payload: { text: string; receiverId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.data.userId;

    const savedMessage = await this.chatService.saveDirectMessage(
      payload.text,
      senderId,
      payload.receiverId,
    );

    this.server
      .to(`user_${payload.receiverId}`)
      .emit('receiveMessage', savedMessage);

    client.emit('receiveMessage', savedMessage);
  }
}
