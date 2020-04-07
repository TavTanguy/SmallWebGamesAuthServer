import { promises as fs } from "fs";
import { resolve } from "path";

export default async function () {
  const key = fs.readFile(process.env["authserver-key"] || "./key.pem");
  const cert = fs.readFile(process.env["authserver-cert"] || "./cert.pem");
  return Promise.all([key, cert]);
}
