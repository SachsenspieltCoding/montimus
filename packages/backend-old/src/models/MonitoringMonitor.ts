import { Monitor as M, MonitorHistory } from '@prisma/client';
import { logger, prisma } from '../backend';
import MonitoringHistory from './MonitoringHistory';

export enum MonitorType {
  HTTP = 'http',
}

export default class MonitoringMonitor implements M {
  id: number;
  name: string;
  description: string | null;
  type: string;
  url: string;
  interval: number;
  createdAt: Date;
  updatedAt: Date;
  parameters_json: string;
  ownerId: number | null;

  private cachedLastHistory: MonitorHistory | null = null;

  constructor(monitor: M) {
    this.id = monitor.id;
    this.name = monitor.name;
    this.description = monitor.description;
    this.type = monitor.type;
    this.url = monitor.url;
    this.interval = monitor.interval;
    this.parameters_json = monitor.parameters_json;
    this.createdAt = monitor.createdAt;
    this.updatedAt = monitor.updatedAt;
    this.ownerId = monitor.ownerId;
  }

  /**
   * Checks the monitor
   * @returns void
   */
  async check() {
    const lastHistory = await this.getLastHistory();

    if (
      lastHistory &&
      lastHistory.createdAt.getTime() + this.interval * 1000 > Date.now() // If the last history is not older than the interval, we don't need to check
    ) {
      return;
    }

    const history = await this.checkLogic();
    logger.debug(
      '[monitoring] (#%s) Url: %s    Ping: %s     Status: %s',
      this.id,
      this.url,
      history.ping,
      history.status,
    );

    const newHistory = await prisma.monitorHistory.create({
      data: history.data,
    });

    if (this.cachedLastHistory && newHistory.status !== this.cachedLastHistory.status) {
      logger.info(
        '[monitoring] (#%s) Status changed from %s to %s',
        this.id,
        this.cachedLastHistory.status,
        newHistory.status,
      );

      // TODO: Add event messages

      await prisma.monitorEvents.create({
        data: {
          monitorId: this.id,
          oldStatus: this.cachedLastHistory.status,
          newStatus: newHistory.status,
        },
      });
    }

    this.cachedLastHistory = newHistory;
  }

  /**
   * This method should be implemented by the child class
   * It should contain the logic to check the monitor
   * This is not meant to be called directly
   * @returns MonitoringMonitor The updated monitor
   */
  async checkLogic(): Promise<MonitoringHistory> {
    throw new Error('Method not implemented.');
  }

  /**
   * Converts the monitor to a JSON object
   * @returns object
   */
  async toJSON(): Promise<object> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      url: this.url,
      interval: this.interval,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      parameters_json: this.parameters_json,
      ownerId: this.ownerId,
      lastHistory: await this.getLastHistory(),
    };
  }

  private async getLastHistory(): Promise<MonitorHistory | null> {
    if (!this.cachedLastHistory) {
      this.cachedLastHistory = await this.fetchLastHistory();
    }

    return this.cachedLastHistory;
  }

  private fetchLastHistory(): Promise<MonitorHistory | null> {
    return prisma.monitorHistory.findFirst({
      where: {
        monitorId: this.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
