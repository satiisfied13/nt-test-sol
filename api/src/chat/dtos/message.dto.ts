import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  date: string;
}
