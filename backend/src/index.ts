const express = require("express");
const fs = require("fs");
// import { Database } from "sqlite";
// const {open as myOpen} = require("sqlite").open;
const app = express();
const port = 3000;
app.use(express.json());

// db startup
const sqlite3 = require("sqlite3").verbose();
const db = require("sqlite")
  .open({
    filename: "./database/sqlite3.db",
    driver: sqlite3.Database,
  })
  .then((db) => {
    console.log("Opened database successfully", db);
    db.exec(
      "create table if not exists treenodes (id integer primary key autoincrement , name text, parent_id int references treenodes(id), type text, parent_type text);"
    );
    // db.exec("delete from treenodes;");
    // db.exec("delete from files;");
    db.close();
  });

app.get("/api/node", async (req: any, res: any) => {
  console.log(req.query);

  const db = await require("sqlite").open({
    filename: "./database/sqlite3.db",
    driver: sqlite3.Database,
  });

  const node = await db.get("select * from treenodes where id = ?", [
    req.query.id,
  ]);

  const data = {
    node: node,
  };
  console.log("1 record retrieved: res data:", data);
  res.send(data);
  db.close();
});

app.post("/api/node", async (req: any, res: any) => {
  console.log(req.body);

  const db = await require("sqlite").open({
    filename: "./database/sqlite3.db",
    driver: sqlite3.Database,
  });

  await db.run(
    "insert into treenodes (name, parent_id, type, parent_type) values (?,?,?,?)",
    [req.body.name, req.body.parent_id, req.body.type, req.body.parent_type]
  );

  const tree = await db.all("SELECT * FROM treenodes", []);
  const data = {
    tree: tree,
  };
  console.log("1 record inserted: res data:", data);
  res.send(data);
  db.close();
});
app.put("/api/node", (req: any, res: any) => {
  res.send("Hello World!");
});
app.delete("/api/node", async (req: any, res: any) => {
  console.log(req.body, req.query);

  const db = await require("sqlite").open({
    filename: "./database/sqlite3.db",
    driver: sqlite3.Database,
  });
  const myId = req.body.id;
  await db.run(
    // "delete from " + req.body.type + "s where id = " + req.body.id + ";"
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
    [req.body.id]
  );
  const tree = await db.all("SELECT * FROM treenodes", []);
  const data = {
    tree: tree,
  };
  console.log("1 record inserted: res data:", data);
  res.send(data);
  db.close();
});
app.get("/api/filetree", async (req: any, res: any) => {
  const db = await require("sqlite").open({
    filename: "./database/sqlite3.db",
    driver: sqlite3.Database,
  });
  const fileTree = await db.all("SELECT * FROM treenodes", []);
  console.log("query response:", fileTree);
  res.json(fileTree);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
