import sqlite, { sqlite3 } from "sqlite3";
import { readFileSync } from "fs";

export default class Db {
  public static instance = new Db();

  private sqlite: sqlite.Database;

  private constructor() {
    this.sqlite = new sqlite.Database(process.env["authserver-pathDb"] || "./data.db", (err) => {
      if (err) throw err;
      this.run(readFileSync("./createUsers.sql", { encoding: "utf-8" })).catch((err) => {});
    });
  }

  public run(sql: string, params: (number | string | Buffer)[] = []) {
    return new Promise((resolve, reject) => {
      this.sqlite.run(sql, params, (err) => {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  public get(sql: string, params: (number | string | Buffer)[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqlite.get(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}
