import { ContentNode } from './content-node.model';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';

export class Tree {
  currentNode!: ContentNode | undefined;
  previousNode!: ContentNode | undefined;
  dataSource: MatTreeNestedDataSource<ContentNode>;
  treeControl: NestedTreeControl<ContentNode, ContentNode>;
  nodeMap!: Map<number, ContentNode>;

  constructor(
    dataSource: MatTreeNestedDataSource<ContentNode>,
    treeControl: NestedTreeControl<ContentNode, ContentNode>
  ) {
    this.dataSource = dataSource;
    this.treeControl = treeControl;
    this.currentNode = dataSource.data[0];
    this.nodeMap = new Map<number, ContentNode>();
  }
}
