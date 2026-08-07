import type { Request, Response } from 'express';

function healthCheck(_req: Request, res: Response) {
  res.status(200).json({ status: 200, message: 'Auth microservice service is active' });
}


export default {
  healthCheck,
};
