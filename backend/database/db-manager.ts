import { DataSource } from "typeorm";
import ormConfig from "../ormconfig.json" assert { type: "json" };

class DatabaseService {
  private db: DataSource | undefined;
  constructor() {
    // @ts-ignore
    new DataSource(<any>ormConfig)
      .initialize()
      .then((db) => {
        console.log("Data Source has been initialized!");
        this.db = db;
      })
      .catch((err) => {
        console.error("Error during Data Source initialization!", err);
      });
  }

  public async getNode(id) {
    if (!this.db) throw new Error("Database not initialized");
    return this.db.getRepository("TreeNode").findOne(id);
  }

  public async createNode(createNode: any) {
    if (!this.db) throw new Error("Database not initialized");
    await this.db.getRepository("TreeNode").save(createNode);
    return this.getFileTree();
  }
  async createNodes(parent) {
    if (!this.db) throw new Error("Database not initialized");
    for (let node of parent.sections) {
      console.log("createNodes: inserting node:", node.text);
      await this.db.getRepository("TreeNode").save(node);
    }
    return await this.getFileTree();
  }
  public async updateNode(node: any) {
    if (!this.db) throw new Error("Database not initialized");
    this.db.getRepository("TreeNode").save(node);
  }

  public async getFileTree() {
    if (!this.db) throw new Error("Database not initialized");
    return this.db.getRepository("TreeNode").find();
  }

  public async deleteNode(id: number) {
    if (!this.db) throw new Error("Database not initialized");
    await this.db.manager.query(
      `
WITH RECURSIVE delete_tree AS (
  SELECT id, parent_id
  FROM tree_node
  WHERE id = $1
  UNION
  SELECT f.id, f.parent_id
  FROM tree_node f
  JOIN delete_tree dt ON f.parent_id = dt.id
)
DELETE FROM tree_node
WHERE id IN (SELECT id FROM delete_tree);
    `,
      [id]
    );
    return this.getFileTree();
  }
}
export default DatabaseService;
