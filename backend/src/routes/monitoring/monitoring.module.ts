import { Module } from '@nestjs/common';
import { MonitoringRESTController } from './monitoring.controller';
import { MonitoringRESTService } from './monitoring.service';

@Module({
  controllers: [MonitoringRESTController],
  providers: [MonitoringRESTService],
})
export class MonitoringRESTModule {}
