import { Module } from '@nestjs/common';
import { HttpMonitor } from './monitor-types/httpMonitor';
import { MonitoringService } from './monitoring.service';

export const MonitorType = {
  HTTP: HttpMonitor,
};

@Module({
  providers: [MonitoringService],
})
export class MonitoringModule {
  constructor(private monitoringService: MonitoringService) {
    this.monitoringService.init();
  }
}
