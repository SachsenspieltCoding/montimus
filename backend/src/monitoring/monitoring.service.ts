import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Monitor } from './models/Monitor';
import { MonitorType } from './monitoring.module';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private monitors: Monitor[] = [];

  constructor(private prisma: PrismaService) {}

  /**
   * Initializes all monitors from the database
   * @returns {Promise<void>} A promise that resolves when all monitors are created
   */
  async init(): Promise<void> {
    const monitors = await this.prisma.monitor.findMany({});

    for (const monitor of monitors) {
      const monitorType = MonitorType[monitor.type.toUpperCase()];
      if (monitorType) {
        this.logger.log(`Creating monitor ${monitor.name}`);
        const monitorInstance = new monitorType(monitor, this.prisma);
        this.monitors.push(monitorInstance);
      } else {
        this.logger.warn(`Monitor ${monitor.name} has an invalid type ${monitor.type}`);
      }
    }

    this.logger.log('Created all monitors from db');
    this.startAll();
  }

  /**
   * Starts all monitors
   * @returns {void}
   */
  startAll(): void {
    this.monitors.forEach((monitor) => monitor.start());
  }

  /**
   * Stops all monitors
   * @returns {void}
   */
  stopAll(): void {
    this.monitors.forEach((monitor) => monitor.stop());
  }

  /**
   * Returns all monitors
   * @returns {Monitor[]} An array of monitors
   */
  getMonitors(): Monitor[] {
    return this.monitors;
  }

  /**
   * Returns a monitor by its id
   * @param {number} id The id of the monitor
   * @returns {Monitor} The monitor
   */
  getMonitor(id: number): Monitor {
    return this.monitors.find((monitor) => monitor.id === id);
  }

  /**
   * Returns a monitor by its name
   * @param {string} name The name of the monitor
   * @returns {Monitor} The monitor
   */
  getMonitorByName(name: string): Monitor {
    return this.monitors.find((monitor) => monitor.name === name);
  }
}
