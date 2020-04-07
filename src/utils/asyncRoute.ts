import { Response, Request, NextFunction } from "express";

export default function (func: (req: Request, res: Response) => Promise<void>): (req: Request, res: Response, next: NextFunction) => void {
  return function (req: Request, res: Response, next: NextFunction) {
    func(req, res).catch(next);
  };
}
