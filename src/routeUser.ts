import { Router, Response, Request } from "express";
import asyncRoute from "./utils/asyncRoute";
import ApiError from "./utils/ApiError";
import { get, create } from "./getUser";

export function setRoutes(router: Router) {
  router.get("/login", asyncRoute(logUser));
  router.post("/register", asyncRoute(registreUser));
}

async function logUser(req: Request, res: Response) {
  const name = req.query.name;
  const password = req.query.password;

  if (!name || !password) throw new ApiError(400, "routeUser-logUser0", "Incorrect argument");

  const user = await get(name, password);
  res.json({
    type: "success",
    user: user.toString(),
  });
  res.status(200);
}

async function registreUser(req: Request, res: Response) {
  const name = req.body.name;
  const password = req.body.password;
  const avatar = req.body.avatar;

  if (!name || !password) throw new ApiError(400, "routeUSer-registreUser0", "Incorrect argument");

  const user = await create(name, password, avatar);
  if (!user) throw new ApiError(500, "routeUSer-registreUser1", "Can't create user");
  res.json({
    type: "success",
    user: user.toString(),
    avatar: user.avatar,
  });
  res.status(201);
}
