import express from "express";
import DatabaseService from "../database/db-manager.ts";

const app = express();
const port = 3000;
app.use(express.json());

let db = await new DatabaseService();

app.get("/api/node", async (req: any, res: any) => {
  console.log(req.query);
  const data = {
    node: await db.getNode(req.query.id),
  };
  console.log("1 record retrieved: res data:", data);
  res.send(data);
});
app.post("/api/node", async (req: any, res: any) => {
  console.log(req.body);
  const data = {
    tree: await db.createNode(req.body),
  };
  console.log("1 record inserted: res data:", data);
  res.send(data);
});
app.put("/api/node", (req: any, res: any) => {
  res.send("Not yet implemented");
});
app.delete("/api/node", async (req: any, res: any) => {
  console.log(req.body, req.query);
  const data = {
    tree: await db.deleteNode(req.body.id),
  };
  console.log("1 record inserted: res data:", data);
  res.send(data);
});
app.get("/api/filetree", async (req: any, res: any) => {
  const fileTree = await db.getFileTree();
  console.log("query response:", fileTree);
  res.json(fileTree);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});