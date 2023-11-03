import { Response } from 'express'

/**
 *
 * @param res The response object to send the response to
 * @param status The http status code
 * @param message The message to send (optional)
 * @param data The data to send (optional)
 */
export function sendResponse(
  res: Response,
  status = 200,
  message?: string,
  data?: any
) {
  res.status(status).json({
    status,
    message,
    data,
  })
}
