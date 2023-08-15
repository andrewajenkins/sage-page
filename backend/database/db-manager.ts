import { Database } from "sqlite";

import sqlite3 from "sqlite3";
import * as sqlite from "sqlite";

class DatabaseService {
  private db: Database | undefined;
  constructor() {
    sqlite
      .open({
        filename: "./database/sqlite3.db",
        driver: sqlite3.Database,
      })
      .then((db) => {
        console.log("Opened database successfully");
        this.db = db;
        db.exec(
          "create table if not exists treenodes (id integer primary key autoincrement, name text, parent_id integer references treenodes(id), type text, text text, content text, parent_type text, textType integer);"
        );
        db.exec("delete from treenodes;");
      });
  }

  public async getNode(id) {
    if (!this.db) throw new Error("Database not initialized");
    return await this.db.get("select * from treenodes where id = ?", [id]);
  }

  public async createNode(node: any) {
    if (!this.db) throw new Error("Database not initialized");
    console.log(
      "create result:",
      await this.db.run(
        "insert into treenodes (name, parent_id, type, parent_type, textType) values (?,?,?,?,?)",
        [node.name, node.parent_id, node.type, node.parent_type, node.textType]
      )
    );
    const lastId = await this.db.get("select last_insert_rowid();");
    return {
      tree: await this.getFileTree(),
      id: lastId["last_insert_rowid()"],
    };
  }

  public async getFileTree() {
    if (!this.db) throw new Error("Database not initialized");
    return await this.db.all("SELECT * FROM treenodes", []);
  }

  public async deleteNode(id: number) {
    if (!this.db) throw new Error("Database not initialized");
    await this.db.run(
      `
WITH RECURSIVE delete_tree AS (
    SELECT id, parent_id
    FROM treenodes
    WHERE id = ?
    UNION
    SELECT f.id, f.parent_id
    FROM treenodes f
    JOIN delete_tree dt ON f.parent_id = dt.id
)
DELETE FROM treenodes
WHERE id IN (SELECT id FROM delete_tree);
    `,
      [id]
    );
    return this.getFileTree();
  }
}
export default DatabaseService;
