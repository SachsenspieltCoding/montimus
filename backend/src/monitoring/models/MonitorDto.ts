import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Monitor } from '@prisma/client';

export class MonitorDto implements Monitor {
  @ApiProperty({
    description: 'The ID of the monitor',
  })
  id: number;

  @ApiProperty({
    description: 'The name of the monitor',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'A description of the monitor',
  })
  description: string;

  @ApiProperty({
    description: 'The type of monitor',
  })
  type: string;

  @ApiProperty({
    description: 'The URL to monitor',
  })
  url: string;

  @ApiProperty({
    description: 'The interval in seconds between checks',
  })
  interval: number;

  @ApiProperty({
    format: 'JSON',
    description: 'The parameters of the monitor, depending on the type',
  })
  parameters_json: string;

  @ApiProperty({
    description: 'The date the monitor was created',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date the monitor was last updated',
  })
  updatedAt: Date;

  ownerId: number;
}
