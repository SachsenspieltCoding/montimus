import { IsNotEmpty, IsString, Length } from 'class-validator';

export default class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 32)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 32)
  password: string;
}
