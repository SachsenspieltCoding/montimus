import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export default class LoginDto {
  @ApiProperty({
    description: 'The username to login with',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 32)
  username: string;

  @ApiProperty({
    description: 'The password to login with',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 32)
  password: string;
}
