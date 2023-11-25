import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { MonitoringRESTService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringRESTController {
  constructor(private readonly monitoringService: MonitoringRESTService) {}

  @Post('create')
  create(@CurrentUser() user: User, @Body() createMonitoringDto: CreateMonitorDto) {
    return this.monitoringService.create(createMonitoringDto, user);
  }

  @Get()
  findAll() {
    return this.monitoringService.getAllMonitors();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monitoringService.getMonitor(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonitoringDto: UpdateMonitorDto) {
    return this.monitoringService.update(+id, updateMonitoringDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return { deleted: await this.monitoringService.remove(+id) };
  }
}
