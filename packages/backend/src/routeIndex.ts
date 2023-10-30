import { Route } from './route'
import express, { Express } from 'express'
import helloworld from './routes/helloworld'
import monitors from './routes/monitors'

const router = express.Router()

export default (app: Express) => {
  registerRoute(helloworld)
  registerRoute(...monitors)

  app.use(router)
}

function registerRoute(...routes: Route[]) {
  for (const route of routes) {
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
