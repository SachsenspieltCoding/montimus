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
} from 'class-validator';
import { MonitorType } from 'src/monitoring/monitoring.module';

export class CreateMonitorDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 128)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  description?: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.keys(MonitorType))
  type: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 512)
  url: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  interval: number;

  @IsOptional()
  @IsJSON()
  parameters_json?: string;
}
