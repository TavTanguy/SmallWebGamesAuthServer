import { config } from "dotenv";
config();
import "./db";
import express from "express";
import bodyParser from "body-parser";
import router, { onError } from "./router";
import { createServer } from "https";
import getKeyAndCert from "./utils/getKeyAndCert";

(async () => {
  const serverWeb = express();
  const [key, cert] = await getKeyAndCert();
  createServer({ key, cert }, serverWeb);
  serverWeb.use(bodyParser.urlencoded({ extended: true }));
  serverWeb.use(bodyParser.json());
  serverWeb.use("/apiv1/", router);
  serverWeb.use(onError);

  const port = process.env["authserver-port"] || 8080;
  serverWeb.listen(port, () => {
    console.log("Server http listen at *:" + port);
  });
})();
