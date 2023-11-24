import { Monitor as M } from '@prisma/client';
import { Monitor, MonitorStatus, OmittedMonitorHistory } from '../models/Monitor';

export class HttpMonitor extends Monitor {
  constructor(data: M) {
    super(data);
  }

  override async check(): Promise<OmittedMonitorHistory> {
    try {
      const start = Date.now();
      const fetched = await fetch(this.url, {
        ...JSON.parse(this.parameters_json),
      });
      const end = Date.now();
      return {
        ping: end - start,
        status: fetched.status === 200 ? MonitorStatus.UP : MonitorStatus.DOWN,
        info_json: JSON.stringify({
          status: fetched.status,
          statusText: fetched.statusText,
          headers: fetched.headers,
        }),
      };
    } catch (e) {
      return {
        ping: -1,
        status: MonitorStatus.DOWN,
        info_json: JSON.stringify({
          error: e,
        }),
      };
    }
  }
}
