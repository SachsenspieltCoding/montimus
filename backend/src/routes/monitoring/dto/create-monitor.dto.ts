import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import { MonitorType } from 'src/monitoring/monitoring.module';

export class CreateMonitorDto {
  @ApiProperty({
    description: 'The name of the monitor',
    minLength: 3,
    maxLength: 128,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 128)
  name: string;

  @ApiProperty({
    description: 'A description of the monitor',
    required: false,
    maxLength: 512,
  })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  description?: string;

  @ApiProperty({
    enum: Object.keys(MonitorType),
    description: 'The type of monitor',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.keys(MonitorType))
  type: string;

  @ApiProperty({
    description: 'The URL to monitor',
    minLength: 3,
    maxLength: 512,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 512)
  url: string;

  @ApiProperty({
    description: 'The interval in seconds between checks',
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  interval: number;

  @ApiProperty({
    required: false,
    format: 'JSON',
    description: 'The JSON parameters to pass to the monitor, depending on the type',
  })
  @IsOptional()
  @IsJSON()
  parameters_json?: string;
}
