import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/user.entity';
import { ChatModule } from './chat/chat.module';
import { Message } from './database/message.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'myuser',
      password: 'mypassword',
      database: 'mydatabase',
      entities: [User, Message],
      synchronize: true,
    }),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
