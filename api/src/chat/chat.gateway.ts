import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private chatService: ChatService) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Клиент подключился: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Клиент отключился: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() payload: { text: string; userId: number },
  ) {
    console.log('Новое сообщение:', payload);
    const savedMessage = await this.chatService.saveMessage(
      payload.text,
      payload.userId,
    );
    this.server.emit('receiveMessage', savedMessage);
  }
}
