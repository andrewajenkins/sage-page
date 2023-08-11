const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

let db;

export async function getDb() {
  if (!db) {
    db = await sqlite.open({
      filename: "./database/sqlite3.db",
      driver: sqlite3.Database,
    });
    console.log("Opened database successfully", db);
    db.exec(
      "create table if not exists treenodes (id integer primary key autoincrement , name text, parent_id int references treenodes(id), type text, parent_type text);"
    );
    db.exec("delete from treenodes;");
  }
  return db;
}

class DbManager {
  constructor() {}
}
