import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { MonitorDto } from 'src/monitoring/models/MonitorDto';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { MonitoringRESTService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringRESTController {
  constructor(private readonly monitoringService: MonitoringRESTService) {}

  @Post('create')
  @ApiCreatedResponse({
    description: 'The monitor has been successfully created.',
    type: MonitorDto,
  })
  @ApiTags('Monitoring')
  createMonitor(@CurrentUser() user: User, @Body() createMonitoringDto: CreateMonitorDto) {
    return this.monitoringService.create(createMonitoringDto, user);
  }

  @Get()
  @ApiOkResponse({
    description: 'All monitors',
    type: [MonitorDto],
  })
  @ApiTags('Monitoring')
  getAllMonitors() {
    return this.monitoringService.getAllMonitors();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The monitor',
    type: MonitorDto,
  })
  @ApiNotFoundResponse({ description: 'The monitor was not found' })
  @ApiTags('Monitoring')
  getMonitor(@Param('id') id: string) {
    return this.monitoringService.getMonitor(+id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The monitor has been successfully updated.',
    type: MonitorDto,
  })
  @ApiNotFoundResponse({ description: 'The monitor was not found' })
  @ApiTags('Monitoring')
  update(@Param('id') id: string, @Body() updateMonitoringDto: UpdateMonitorDto) {
    return this.monitoringService.update(+id, updateMonitoringDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The monitor has been successfully deleted.',
    type: MonitorDto,
  })
  @ApiNotFoundResponse({ description: 'The monitor was not found' })
  @ApiTags('Monitoring')
  async remove(@Param('id') id: string) {
    return { deleted: await this.monitoringService.remove(+id) };
  }

  @Get(':id/history')
  async getHistory(@Param('id') id: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.monitoringService.getHistory(+id, limit, offset);
  }

  // @Get(':id/history/latest')
  // async getLatestHistory(@Param('id') id: string) {
  //   return this.monitoringService.getLatestHistory(+id);
  // }

  @Get(':id/history/ping/raw')
  async getPingHistory(@Param('id') id: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.monitoringService.getPingRaw(+id, limit, offset);
  }
}
