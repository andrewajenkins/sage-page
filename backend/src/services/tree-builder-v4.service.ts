import { TreeNode } from "../entity/tree-node.entity.ts";
import { DataSource } from "typeorm";

export class TreeBuilderService {
  db: DataSource | undefined;
  constructor(db) {
    this.db = db;
  }

  async generate(parent: TreeNode) {
    console.log("generating:", parent);
    const parseResult = this.parseNodes(parent);
    // adjust nodes
    // map parent_id
    const populatedParent = await this.buildMap(parseResult);
    return populatedParent;
  }

  private async buildMap(parent: TreeNode) {
    const depthMap = new Map<number, TreeNode>();
    const sections = parent.sections;
    parent.sections = [];
    depthMap.set(0, parent);
    if (!this.db) throw new Error("Database not initialized");
    console.log("processing sections:", sections);
    for (let i = 0; i < sections.length; i++) {
      const node = sections[i];
      if (node.depth) {
        const localParent = this.getParent(depthMap, node.depth);
        node.generated = true;
        node.type = "heading";
        node.parent_id = localParent.id;
        console.log("processing header:", node);
        const result = await this.db.getRepository("TreeNode").save(node);
        localParent!.sections.push(result);
        depthMap.set(result.depth, result);
        console.log("processed header:", node);
        while (sections[i + 1] && sections[i + 1].depth == undefined) {
          const subNode = sections[++i];
          console.log("CONTENT WITH DEPTH:", subNode.depth, subNode);
          subNode.generated = true;
          subNode.type = "content";
          subNode.parent_id = node.id;
          const result = await this.db.getRepository("TreeNode").save(subNode);
          node.content.push(result);
          console.log("processed content:", result);
        }
      }
    }
    return { populatedParent: parent };
  }
  private getParent(depthMap: Map<number, TreeNode>, depth: number): TreeNode {
    //adjust for parent depth
    const startIndex = depth ? depth - 1 : depthMap.size;
    for (let i = depth - 1; i >= 1; i--) {
      if (depthMap.has(i)) {
        return depthMap.get(i) as TreeNode;
      }
    }
    return depthMap.get(0) as TreeNode;
  }
  private parseNodes(parent: TreeNode) {
    parent.sections.forEach((node) => {
      this.parse(node);
    });
    return parent;
  }
  private parse(node: TreeNode) {
    const text = node.text;
    if (!text) return;
    if (text.startsWith("- ###### ")) {
      node.depth = 6;
      node.name = text.substring(9);
    } else if (text.startsWith("###### ")) {
      node.depth = 6;
      node.name = text.substring(7);
    } else if (text.startsWith("- ##### ")) {
      node.depth = 5;
      node.name = text.substring(8);
    } else if (text.startsWith("##### ")) {
      node.depth = 5;
      node.name = text.substring(6);
    } else if (text.startsWith("- #### ")) {
      node.depth = 4;
      node.name = text.substring(7);
    } else if (text.startsWith("#### ")) {
      node.depth = 4;
      node.name = text.substring(5);
    } else if (text.startsWith("- ### ")) {
      node.depth = 3;
      node.name = text.substring(6);
    } else if (text.startsWith("### ")) {
      node.depth = 3;
      node.name = text.substring(4);
    } else if (text.startsWith("- ## ")) {
      node.depth = 2;
      node.name = text.substring(5);
    } else if (text.startsWith("## ")) {
      node.depth = 2;
      node.name = text.substring(3);
    } else if (text.startsWith("- # ")) {
      node.depth = 1;
      node.name = text.substring(2);
    } else if (text.startsWith("# ")) {
      node.depth = 1;
      node.name = text.substring(2);
    } else if (text.startsWith("- [")) {
      node.name = text.replace(/.*\[(.*?)\.*]/g, "$1");
    } else if (text.startsWith("- ")) {
      node.name = text.substring(2);
    } else if (text.startsWith(" - ")) {
      node.name = text.substring(3);
    } else if (text.startsWith("  - ")) {
      node.name = text.substring(4);
    } else {
      node.name = text;
    }
    return node;
  }
}
