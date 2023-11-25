import { Injectable, Logger } from '@nestjs/common';
import { Monitor as PrismaMonitor } from '@prisma/client';
import { MontimusError } from 'src/common/errorCodes';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMonitorDto } from 'src/routes/monitoring/dto/create-monitor.dto';
import { UpdateMonitorDto } from 'src/routes/monitoring/dto/update-monitor.dto';
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
    monitors.forEach((monitor) => this.monitors.push(this.instanciateMonitor(monitor)));
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
   * Creates a partial monitor
   * @param {Monitor} monitor The monitor
   * @returns {Partial<Monitor>} The partial monitor
   */
  partialMonitor(monitor: Monitor): Partial<Monitor> {
    return {
      id: monitor.id,
      name: monitor.name,
      description: monitor.description,
      type: monitor.type,
      url: monitor.url,
      interval: monitor.interval,
      parameters_json: monitor.parameters_json,
      updatedAt: monitor.updatedAt,
    };
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
   * @returns {Monitor | null} The monitor or null if not found
   */
  getMonitor(id: number): Monitor | null {
    const monitor = this.monitors.find((monitor) => monitor.id === id);
    if (!monitor) return null;
    return monitor;
  }

  /**
   * Creates a monitor
   * @param {CreateMonitorDto} monitorDto The monitor dto
   * @param {number} ownerId The id of the owner
   * @returns {Promise<Monitor>} The created monitor
   */
  async createMonitor(monitorDto: CreateMonitorDto, ownerId: number): Promise<Monitor> {
    const monitor = await this.prisma.monitor.create({
      data: {
        ...monitorDto,
        ownerId,
      },
    });
    const monitorInstance = this.instanciateMonitor(monitor);
    this.monitors.push(monitorInstance);
    monitorInstance.start();
    return monitorInstance;
  }

  /**
   * Instanciates a monitor from a prisma monitor
   * @param {PrismaMonitor} monitor The prisma monitor
   * @returns {Monitor} The monitor
   * @throws {Error} If the monitor type is invalid
   */
  instanciateMonitor(monitor: PrismaMonitor): Monitor {
    const monitorType = MonitorType[monitor.type.toUpperCase()];
    if (monitorType) {
      const monitorInstance = new monitorType(monitor, this.prisma);
      return monitorInstance;
    } else {
      throw new Error(MontimusError.INVALID_MONITOR_TYPE(monitor.type).toString());
    }
  }

  /**
   * Deletes a monitor
   * @param {number} id The id of the monitor
   * @returns {Promise<boolean>} A promise that resolves to true if the monitor was deleted
   */
  async deleteMonitor(id: number): Promise<boolean> {
    const monitor = this.getMonitor(id);
    if (!monitor) throw new Error(MontimusError.MONITOR_NOT_FOUND.toString());
    monitor.stop();
    await this.prisma.monitor.delete({
      where: {
        id,
      },
    });
    this.monitors = this.monitors.filter((monitor) => monitor.id !== id);
    this.logger.log(`Deleted monitor ${id}`);
    return true;
  }

  /**
   * Updates a monitor
   * @param {number} id The id of the monitor
   * @param {UpdateMonitorDto} updateMonitorDto The updated monitor
   * @returns {Promise<Monitor>} The updated monitor
   */
  async updateMonitor(id: number, updateMonitorDto: UpdateMonitorDto): Promise<Monitor> {
    const monitor = this.getMonitor(id);
    if (!monitor) throw new Error(MontimusError.MONITOR_NOT_FOUND.toString());
    await this.prisma.monitor.update({
      where: {
        id,
      },
      data: {
        ...updateMonitorDto,
      },
    });
    monitor.update(updateMonitorDto);
    return monitor;
  }
}
