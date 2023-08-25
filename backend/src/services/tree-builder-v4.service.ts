import { TreeNode } from "../entity/tree-node.entity.ts";
import { DataSource } from "typeorm";

export class TreeBuilderService {
  db: DataSource | undefined;
  constructor(db) {
    this.db = db;
  }

  async generate(parent: TreeNode) {
    console.log("generating:", parent);
    if (!parent) return { populatedParent: parent };
    const parseResult = this.parseNodes(parent);
    const populatedParent = await this.buildMap(parseResult);
    return populatedParent;
  }

  private async buildMap(parent: TreeNode) {
    if (parent?.type == "folder") {
      for (let node of parent.subNodes) {
        if (node.type == "folder") {
          console.log("buildMap: folder:", node);
          await this.buildFolder(node);
        } else {
          console.log("buildMap: section:", node);
          await this.build(node);
        }
      }
    } else if (parent?.sections?.length > 0) {
      for (let node of parent.sections) {
        console.log("buildMap: section:", node);
        await this.build(node);
      }
    }
    console.log("buildMap: returning parent:", parent);
    return { populatedParent: parent };
  }
  private async buildFolder(parent) {
    const depthMap = new Map<number, TreeNode>();
    const subNodes = parent.subNodes;
    parent.subNodes = [];
    depthMap.set(0, parent);
    if (!this.db) throw new Error("Database not initialized");
    console.log("buildFolder: subNodes:", subNodes);
    for (let i = 0; i < subNodes?.length; i++) {
      const node = subNodes[i];
      if (node.type == "folder") {
        const localParent = this.getParent(depthMap, node.depth);
        node.generated = true;
        node.type = "folder";
        node.parent_id = localParent.id;
        console.log("buildFolder: folder:", node);
        const result = await this.db.getRepository("TreeNode").save(node);
        localParent!.subNodes.push(result);
        depthMap.set(result.depth, result);
        console.log("buildFolder: folder: final:", node);
        await this.buildFolder(result);
      } else {
        const localParent = this.getParent(depthMap, node.depth);
        node.generated = true;
        node.type = "section";
        node.parent_id = localParent.id;
        console.log("buildFolder: section:", node);
        const result = await this.db.getRepository("TreeNode").save(node);
        localParent!.sections.push(result);
        depthMap.set(result.depth, result);
        console.log("buildFolder: section: final:", node);
        await this.build(result);
      }
    }
  }
  private async build(parent: TreeNode) {
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
    // return { populatedParent: parent };
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
    if (parent.type === "folder" && parent.subNodes?.length > 0) {
      parent.subNodes.forEach((node) => {
        this.parse(node);
      });
    } else if (parent.sections?.length > 0) {
      parent.sections.forEach((node) => {
        this.parse(node);
      });
    }
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
