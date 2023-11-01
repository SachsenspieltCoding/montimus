import MonitoringMonitor from './MonitoringMonitor'

export enum MonitoringHistoryStatus {
  UNKNOWN = -1,
  DOWN = 0,
  UP = 1,
}

export default class MonitoringHistory {
  monitor: MonitoringMonitor
  status: MonitoringHistoryStatus
  createdAt: Date
  ping: number | null
  info: {}

  constructor(
    monitor: MonitoringMonitor,
    options: { status: number; info?: {}; ping?: number }
  ) {
    this.monitor = monitor
    this.status = options.status
    this.createdAt = new Date()
    this.ping = options.ping || null
    this.info = options.info || {}
  }

  get data() {
    return {
      monitorId: this.monitor.id,
      status: this.status,
      createdAt: this.createdAt,
      ping: this.ping,
      info_json: JSON.stringify(this.info),
    }
  }
}
