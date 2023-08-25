import express from "express";
import DatabaseService from "../database/db-manager.ts";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.json());

let db = await new DatabaseService();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} ${JSON.stringify(req?.body)}`);
  next();
});

app.get("/api/node", async (req: any, res: any) => {
  const data = {
    node: await db.getNode(req.query.id),
  };
  console.log("1 record retrieved: res data:", data);
  res.send(data);
});
app.post("/api/node", async (req: any, res: any) => {
  const data = await db.createNode(req.body);
  console.log("1 record inserted: res data:", data);
  res.send(data);
});
app.post("/api/nodes", async (req: any, res: any) => {
  console.log("creating nodes:", req.body);
  const data = await db.createNodes(req.body);
  console.log(req.body, " records inserted: res data:", data);
  res.send(data);
});
app.post("/api/section", async (req: any, res: any) => {
  const data = await db.createNode(req.body);
  console.log("1 record inserted: res data:", data);
  res.send(data);
});
app.put("/api/node", async (req: any, res: any) => {
  const data = await db.updateNode(req.body);
  console.log("1 record updated: res data:", data);
  res.status(204).end();
});
app.delete("/api/node", async (req: any, res: any) => {
  console.log(req.body, req.query);
  const data = await db.deleteNode(req.body.id);
  console.log("1 record deleted: res data:", data);
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
