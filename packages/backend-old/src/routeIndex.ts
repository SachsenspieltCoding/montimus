import express, { Express } from 'express';
import { Route } from './route';
import helloworld from './routes/helloworld';
import login from './routes/login';
import history from './routes/monitoring/history';
import monitors from './routes/monitoring/monitors';
import register from './routes/register';

const router = express.Router();
const routes: Route[] = [];

export default (app: Express) => {
  registerRoute(helloworld);

  // Monitoring
  registerRoute(...monitors);
  registerRoute(...history);

  // Authentication
  registerRoute(...[register, login]);

  app.use(router);
};

function registerRoute(...paramRoutes: Route[]) {
  routes.push(...paramRoutes);

  for (const route of paramRoutes) {
    switch (route.method) {
      case 'GET':
        router.get(route.path, route.handler);
        break;
      case 'POST':
        router.post(route.path, route.handler);
        break;
      case 'PUT':
        router.put(route.path, route.handler);
        break;
      case 'DELETE':
        router.delete(route.path, route.handler);
        break;
      case 'PATCH':
        router.patch(route.path, route.handler);
        break;
      default:
        throw new Error(`Unknown method ${route.method}`);
    }
  }
}

export function getRoutes(): Route[] {
  return routes;
}

export function getRoute(path: string, method: string): Route | undefined {
  return routes.find(
    (route) =>
      (route.path === path || `${route.path}/` === path) && route.method.toLowerCase() === method.toLowerCase(),
  );
}
