import EventEmitter from "events";
import { logger, prisma } from "../backend";
import MonitoringMonitor from "../models/MonitoringMonitor";
import HttpMonitor from "./types/HttpMonitor";

let monitors: MonitoringMonitor[] = [];

export const monitoringEmitter = new EventEmitter();

export async function initMonitoring() {
  const mons = await prisma.monitor.findMany();

  for (const mon of mons) {
    switch (mon.type) {
      case "http":
        monitors.push(new HttpMonitor(mon));
        break;
      default:
        logger.warn("Unknown monitor type: %s", mon.type);
        break;
    }
  }

  // Start the monitoring, maybe there is a better way to do this?
  setInterval(() => monitoringEmitter.emit("tick"), 1000);
}
