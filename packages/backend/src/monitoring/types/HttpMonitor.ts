import { Monitor, MonitorHistory } from '@prisma/client'
import MonitoringMonitor from '../../models/MonitoringMonitor'
import MonitoringHistory, {
  MonitoringHistoryStatus,
} from '../../models/MonitoringHistory'

export default class HttpMonitor extends MonitoringMonitor {
  constructor(monitor: Monitor) {
    super(monitor)
  }

  override async checkLogic() {
    return new Promise<MonitoringHistory>(async (resolve) => {
      const start = Date.now()
      const fetched = await fetch(this.url) // TODO: Use parameters from this.parameters_json
      const end = Date.now()
      resolve(
        new MonitoringHistory(this, {
          status:
            fetched.status === 200
              ? MonitoringHistoryStatus.UP
              : MonitoringHistoryStatus.DOWN,
          ping: end - start,
          info: {
            status: fetched.status,
            statusText: fetched.statusText,
            headers: fetched.headers,
          },
        })
      )
    })
  }
}
