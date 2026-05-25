import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ChangeUserNameDto {
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  @IsNotEmpty()
  name!: string;
}
