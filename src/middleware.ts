import type { Request, Response, NextFunction } from "express"

const middleware = async (req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  return next()
}

export default middleware
