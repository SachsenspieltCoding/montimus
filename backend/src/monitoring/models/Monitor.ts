import { Logger } from '@nestjs/common';
import { Monitor as M, MonitorHistory } from '@prisma/client';
import { CronJob, CronTime } from 'cron';

export type OmittedMonitorHistory = Omit<MonitorHistory, 'id' | 'monitorId' | 'createdAt'>;

export const MonitorStatus = {
  UNKNOWN: -1,
  UP: 0,
  DOWN: 1,
};

export class Monitor implements M {
  id: number;
  name: string;
  description: string;
  type: string;
  url: string;
  interval: number;
  parameters_json: string;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;

  private job: CronJob;
  protected logger: Logger;

  constructor(data: M) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.type = data.type;
    this.url = data.url;
    this.interval = data.interval;
    this.parameters_json = data.parameters_json;
    this.ownerId = data.ownerId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.logger = new Logger(`Monitor - ${this.name} (${this.id})`);

    this.job = new CronJob(`*/${this.interval} * * * * *`, () => {
      this.check();
    });
  }

  /**
   * Runs a check on the monitor
   * @returns {Promise<OmittedMonitorHistory>} A promise that resolves with the monitor history object
   */
  async check(): Promise<OmittedMonitorHistory> {
    throw new Error('Method not implemented.');
  }

  /**
   * Starts the monitor
   * @returns {void}
   */
  start(): void {
    this.logger.log('Starting monitor');
    this.job.start();
  }

  /**
   * Stops the monitor
   * @returns {void}
   */
  stop(): void {
    this.logger.log('Stopping monitor');
    this.job.stop();
  }

  /**
   * Restarts the monitor
   * @returns {void}
   */
  restart(): void {
    this.logger.log('Restarting monitor');
    this.job.stop();
    this.job.start();
  }

  /**
   * Updates the interval of the monitor
   * @param {number} interval The new interval
   * @returns {void}
   */
  updateInterval(interval: number): void {
    this.logger.log(`Updating interval to ${interval}s`);
    this.interval = interval;
    this.job.setTime(new CronTime(`*/${this.interval} * * * * *`));
    this.restart();
  }

  /**
   * Returns whether the monitor is running
   * @returns {boolean} Whether the monitor is running
   */
  isRunning(): boolean {
    return this.job.running;
  }

  /**
   * Returns the last time the monitor ran
   * @returns {Date} The last time the monitor ran
   */
  get lastRun(): Date {
    return this.job.lastDate();
  }
}
