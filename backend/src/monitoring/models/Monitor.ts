import { Injectable, Logger } from '@nestjs/common';
import { Monitor as M, MonitorHistory } from '@prisma/client';
import { CronJob, CronTime } from 'cron';
import { PrismaService } from 'src/prisma/prisma.service';

export type OmittedMonitorHistory = Omit<MonitorHistory, 'id' | 'monitorId' | 'createdAt'>;

export const MonitorStatus = {
  UNKNOWN: 0,
  UP: 1,
  DOWN: 2,
  DEGRADED: 3,
  MAINTENANCE: 4,
};

@Injectable()
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

  constructor(
    data: M,
    private prisma: PrismaService,
  ) {
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

    this.job = new CronJob(`*/${this.interval} * * * * *`, async () => {
      const history = await this.check();

      const lastHistory = await this.prisma.monitorHistory.findFirst({
        where: {
          monitorId: this.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Check if the status changed since the last check and create an event if it did
      if (lastHistory) {
        if (lastHistory.status !== history.status) {
          this.logger.log(
            `Status changed from ${Object.keys(MonitorStatus)[lastHistory.status]} to ${
              Object.keys(MonitorStatus)[history.status]
            }`,
          );
          await this.prisma.monitorEvents.create({
            data: {
              monitorId: this.id,
              oldStatus: lastHistory.status,
              newStatus: history.status,
              // TODO: Add event messages (e.g. "Monitor was down for 5 minutes", "Monitor is back up")
            },
          });
        }
      }

      await this.prisma.monitorHistory.create({
        data: {
          ...history,
          monitorId: this.id,
        },
      });
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
