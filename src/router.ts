import { Router, Request, Response, NextFunction } from "express";
import ApiError from "./utils/ApiError";
import * as routeUser from "./routeUser";

const router = Router();
routeUser.setRoutes(router);
export default router;

export function onError(err: Error, req: Request, res: Response, next: NextFunction) {
  let appErr: ApiError;
  if (!(err instanceof ApiError)) appErr = new ApiError(500, "unknow", "Internal error", err);
  else appErr = err;
  if (appErr.defaultError) console.error(appErr.defaultError);
  res.json({
    type: "error",
    code: appErr.code,
    message: appErr.message,
  });
  res.status(appErr.httpStatus);
}
