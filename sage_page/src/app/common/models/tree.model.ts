import { ContentNode } from './content-node.model';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';

export class Tree {
  currentNode!: ContentNode | undefined;
  previousNode!: ContentNode | undefined;
  dataSource: MatTreeNestedDataSource<ContentNode>;
  treeControl: NestedTreeControl<ContentNode, ContentNode>;
  nodeMap!: Map<string, ContentNode>;

  constructor() {
    this.dataSource = new MatTreeNestedDataSource<ContentNode>();
    this.treeControl = new NestedTreeControl<ContentNode>((node) => {
      if (node.isFolder()) {
        return node.subNodes;
      } else if (node.isContentNode()) {
        return node.sections;
      }
      return [];
    });
    this.currentNode = this.dataSource.data[0];
    this.nodeMap = new Map<string, ContentNode>();
  }
  setRootNodes(rootNodes: ContentNode[]) {
    this.dataSource.data = rootNodes;
  }

  insert(rootNodes: ContentNode[], currentNode: ContentNode | undefined) {
    if (!currentNode) this.dataSource.data = rootNodes;
    else if (currentNode.isFolder()) currentNode.subNodes.push(...rootNodes);
    else currentNode.sections.push(...rootNodes);
  }

  deleteNode(targetNode: ContentNode | undefined) {
    const removeNode = (nodes: ContentNode[]) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].feId === targetNode?.feId) {
          nodes.splice(i, 1);
          this.currentNode = undefined;
          return;
        }
      }
      for (let node of nodes) {
        if (node.isFolder()) {
          removeNode(node.subNodes);
        } else if (node.isContentNode()) {
          removeNode(node.sections);
        }
      }
    };
    removeNode(this.dataSource.data);
  }
}
