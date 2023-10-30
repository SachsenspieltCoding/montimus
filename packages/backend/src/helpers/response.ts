import { Response } from 'express'

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
