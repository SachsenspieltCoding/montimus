import { sendResponse } from '../helpers/response'
import { Route } from '../route'

export default {
  path: '/helloworld',
  method: 'GET',
  handler: (_req, res) => {
    sendResponse(res, 200, 'Hello World, how are you?')
  },
} as Route
