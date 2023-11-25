import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { MontimusError } from 'src/common/errorCodes';
import { Monitor } from 'src/monitoring/models/Monitor';
import { MonitoringService } from 'src/monitoring/monitoring.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';

@Injectable()
export class MonitoringRESTService {
  constructor(private monitoringService: MonitoringService) {}

  /**
   * Creates a monitor
   * @param {CreateMonitorDto} createMonitoringDto The monitor to create
   * @param {User} user The user that created the monitor
   * @returns {Promise<Partial<Monitor>>} The created monitor
   */
  async create(createMonitoringDto: CreateMonitorDto, user: User): Promise<Partial<Monitor>> {
    const created = await this.monitoringService.createMonitor(createMonitoringDto, user.id);
    return this.monitoringService.partialMonitor(created);
  }

  /**
   * Get all monitors
   * @returns {Partial<Monitor>[]} All monitors
   */
  getAllMonitors(): Partial<Monitor>[] {
    return this.monitoringService.getMonitors().map((monitor) => this.monitoringService.partialMonitor(monitor));
  }

  /**
   * Get a monitor by ID
   * @param {number} id ID of the monitor
   * @returns {Partial<Monitor>} The monitor
   */
  getMonitor(id: number): Partial<Monitor> {
    const monitor = this.monitoringService.getMonitor(id);
    if (!monitor) throw new NotFoundException(MontimusError.MONITOR_NOT_FOUND.toJSON());
    return this.monitoringService.partialMonitor(monitor);
  }

  /**
   * Delete a monitor by ID
   * @param {number} id ID of the monitor
   * @returns {Promise<boolean>} Whether the monitor was deleted
   */
  remove(id: number): Promise<boolean> {
    const monitor = this.monitoringService.getMonitor(id);
    if (!monitor) throw new NotFoundException(MontimusError.MONITOR_NOT_FOUND.toJSON());
    return this.monitoringService.deleteMonitor(id);
  }

  /**
   * Update a monitor by ID
   * @param {number} id ID of the monitor
   * @param {UpdateMonitorDto} updateMonitoringDto The updated monitor
   * @returns {Promise<Partial<Monitor>>} The updated monitor
   */
  async update(id: number, updateMonitoringDto: UpdateMonitorDto): Promise<Partial<Monitor>> {
    const monitor = this.monitoringService.getMonitor(id);
    if (!monitor) throw new NotFoundException(MontimusError.MONITOR_NOT_FOUND.toJSON());
    const updated = await this.monitoringService.updateMonitor(id, updateMonitoringDto);
    return this.monitoringService.partialMonitor(updated);
  }
}
