import db from "./db";
import { hash, compare } from "bcrypt";
import ApiError from "./utils/ApiError";
import User from "./User";
import { promises as fs } from "fs";

User.keyJWT = process.env["authserver-secretKeyJWT"] as string;
if (!User.keyJWT) throw new Error("secretJeyJWT not defind in env");

export async function create(name: string, password: string, avatar?: string) {
  let hashPass = await hash(password, parseInt(process.env["authserver-saltOrRoundsBCrypt"] || "8", 10));
  if (!avatar) avatar = await getDefaultAvatar();
  try {
    await db.instance.run("INSERT INTO Users (username, password, avatar) VALUES (?,?,?)", [name, hashPass, avatar]);
    return new User(name, avatar);
  } catch (err) {
    if (err.errno === 19) throw new ApiError(404, "User-create0", "Username already taken");
    throw err;
  }
}

async function getDefaultAvatar(): Promise<string> {
  let listAvatarPath: string[] = [];
  const dir = await fs.opendir("./defaultAvatars", { encoding: "utf8" });
  for await (const file of dir) {
    if (file.isFile()) listAvatarPath.push(file.name);
  }
  const pathAvatar = listAvatarPath[Math.trunc(Math.random() * Math.floor(listAvatarPath.length - 1))];

  dir.close();
  return fs.readFile(pathAvatar, { encoding: "utf8" });
}

export async function get(name: string, password: string) {
  const user: { password: string; username: string; avatar: string } | undefined = await db.instance.get("SELECT username,avatar,password FROM Users WHERE username = ?", [name]);
  if (!user) throw new ApiError(404, "User-get0", "User not found");
  if (!compare(password, user.password)) throw new ApiError(400, "User-get1", "Whrong password");
  return new User(user.username, user.avatar);
}
