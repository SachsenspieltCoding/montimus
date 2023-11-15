import { Monitor } from '@prisma/client';
import { logger, prisma } from '../backend';
import MonitoringMonitor, { MonitorType } from '../models/MonitoringMonitor';
import HttpMonitor from './types/HttpMonitor';

const monitors: MonitoringMonitor[] = [];

export async function initMonitoring() {
  const mons = await prisma.monitor.findMany();

  mons.forEach((mon) => {
    try {
      monitors.push(fromPrismaMonitor(mon));
    } catch (error) {
      logger.warn('[monitoring] Ignoring monitor %s', mon.id);
    }
  });

  // Start the monitoring, maybe there is a better way to do this?
  setInterval(() => monitors.forEach((mon) => mon.check()), 1000);
}

export function fromPrismaMonitor(monitor: Monitor): MonitoringMonitor {
  switch (monitor.type) {
    case MonitorType.HTTP:
      return new HttpMonitor(monitor);
    default:
      throw new Error(`Unknown monitor type: ${monitor.type}`);
  }
}

export function getMonitors(): MonitoringMonitor[] {
  return monitors;
}

export function getMonitor(id: number): MonitoringMonitor | undefined {
  return monitors.find((monitor) => monitor.id === id);
}

export async function pushMonitor(monitor: MonitoringMonitor) {
  monitors.push(monitor);
  logger.info('[monitoring] (#%s) Pushed new monitor %s of type %s', monitor.id, monitor.name, monitor.type);
}

export async function deleteMonitor(monitor: MonitoringMonitor) {
  const index = monitors.findIndex((mon) => mon.id === monitor.id);

  if (index === -1) return;

  monitors.splice(index, 1);

  logger.info('[monitoring] (#%s) Deleted monitor %s of type %s', monitor.id, monitor.name, monitor.type);
}

export async function updateMonitor(monitor: MonitoringMonitor) {
  const index = monitors.findIndex((mon) => mon.id === monitor.id);

  if (index === -1) return;

  monitors[index] = monitor;

  logger.info('[monitoring] (#%s) Updated monitor %s of type %s', monitor.id, monitor.name, monitor.type);
}

export async function pushPrismaMonitor(monitor: Monitor) {
  pushMonitor(fromPrismaMonitor(monitor));
}

export async function deletePrismaMonitor(monitor: Monitor) {
  deleteMonitor(fromPrismaMonitor(monitor));
}

export async function updatePrismaMonitor(monitor: Monitor) {
  updateMonitor(fromPrismaMonitor(monitor));
}
