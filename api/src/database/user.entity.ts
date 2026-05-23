import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn() Id!: number;

  @Column({ length: 32 }) name!: string;

  @Column({ unique: true }) email!: string;

  @Column() password!: string;

  @OneToMany(() => Message, (message) => message.sender)
  messages!: Message[];
}
