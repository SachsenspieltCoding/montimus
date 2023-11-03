import { Route } from './route'
import express, { Express } from 'express'
import helloworld from './routes/helloworld'
import monitors from './routes/monitors'
import register from './routes/register'
import login from './routes/login'
import exp from 'constants'

const router = express.Router()
const routes: Route[] = []

export default (app: Express) => {
  registerRoute(helloworld)

  // Monitoring
  registerRoute(...monitors)

  // Authentication
  registerRoute(...[register, login])

  app.use(router)
}

function registerRoute(...paramRoutes: Route[]) {
  routes.push(...paramRoutes)

  for (const route of paramRoutes) {
    switch (route.method) {
      case 'GET':
        router.get(route.path, route.handler)
        break
      case 'POST':
        router.post(route.path, route.handler)
        break
      case 'PUT':
        router.put(route.path, route.handler)
        break
      case 'DELETE':
        router.delete(route.path, route.handler)
        break
      case 'PATCH':
        router.patch(route.path, route.handler)
        break
      default:
        throw new Error(`Unknown method ${route.method}`)
    }
  }
}

export function getRoutes(): Route[] {
  return routes
}

export function getRoute(path: string): Route | undefined {
  return routes.find((route) => route.path === path)
}
