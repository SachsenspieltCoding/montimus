import { Monitor as M, MonitorHistory } from "@prisma/client";
import { logger, prisma } from "../backend";
import { monitoringEmitter } from "../monitoring/monitoring";
import MonitoringHistory from "./MonitoringHistory";

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

  private cachedLastHistory: Promise<MonitorHistory | null> =
    Promise.resolve(null);

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

    logger.debug(
      "[monitoring] (#%s) Created new monitor %s of type %s",
      this.id,
      this.name,
      this.type,
    );

    monitoringEmitter.on("tick", async () => {
      const lastHistory = await this.getLastHistory();
      if (!lastHistory) {
        this.check();
        return;
      }

      if (lastHistory.createdAt.getTime() + this.interval * 1000 < Date.now()) {
        this.check();
      }
    });
  }

  /**
   * Checks the monitor
   * @returns void
   */
  async check() {
    const history = await this.checkLogic();
    logger.debug(
      "[monitoring] (#%s) Url: %s    Ping: %s     Status: %s",
      this.id,
      this.url,
      history.ping,
      history.status,
    );
    this.cachedLastHistory = prisma.monitorHistory.create({
      data: history.data,
    });
  }

  /**
   * This method should be implemented by the child class
   * It should contain the logic to check the monitor
   * This is not meant to be called directly
   * @returns MonitoringMonitor The updated monitor
   */
  async checkLogic(): Promise<MonitoringHistory> {
    throw new Error("Method not implemented.");
  }

  private async getLastHistory(): Promise<MonitorHistory | null> {
    if (!(await this.cachedLastHistory)) {
      this.cachedLastHistory = this.fetchLastHistory();
    }

    return this.cachedLastHistory;
  }

  private fetchLastHistory(): Promise<MonitorHistory | null> {
    return prisma.monitorHistory.findFirst({
      where: {
        monitorId: this.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
