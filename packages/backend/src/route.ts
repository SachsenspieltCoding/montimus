import { Request, Response } from 'express'

export interface Route {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  handler: (req: Request, res: Response) => void
}
