import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ContentNode } from './content-node.model';
import { NestedTreeControl } from '@angular/cdk/tree';

export class TreeState {
  dataSource: MatTreeNestedDataSource<ContentNode>;
  treeControl: NestedTreeControl<ContentNode, ContentNode>;
  state;
  constructor(
    dataSource: MatTreeNestedDataSource<ContentNode>,
    treeControl: NestedTreeControl<ContentNode, ContentNode>
  ) {
    this.dataSource = dataSource;
    this.treeControl = treeControl;
  }

  refreshTree(data?: ContentNode[]) {
    let temp, expandCurrent;
    if (!data || data.length == 0) temp = this.dataSource.data;
    else {
      temp = this.dataSource.data;
      if ((expandCurrent = !this.isRootData(data))) {
        this.insertData(data!, temp);
      } else temp = data;
    }
    this.dataSource.data = [];
    this.dataSource.data = temp!;
    this.treeControl.dataNodes = temp!;
    this.applyTreeState(this.state);
    // if (expandCurrent) this.treeControl.expand(this.tree.currentNode!);
  }

  private insertData(data: ContentNode[], treeData: ContentNode[]) {
    const targetNode = data[0] as ContentNode;
    for (let i = 0; i < treeData.length; i++) {
      if (treeData[i].id === targetNode.id) {
        treeData.splice(i, 1, targetNode);
        return;
      }
    }
    treeData.forEach((node: ContentNode) => {
      if (node.isFolder()) {
        return this.insertData(data, node.subNodes);
      } else if (node.isSection()) {
        return this.insertData(data, node.sections);
      }
    });
  }
  private isRootData(data) {
    return !data[0]?.parent_id;
  }

  saveTreeState() {
    const state = new Map<number, boolean>();
    this.populateMap(this.treeControl.dataNodes, state);
    this.state = state;
  }
  private populateMap(dataNodes: ContentNode[], state: Map<number, boolean>) {
    dataNodes?.forEach((node) => {
      state.set(node.id as number, this.treeControl.isExpanded(node));
      if (node.isFolder()) {
        this.populateMap(node.subNodes, state);
      } else if (node.isContentNode() || node.isContent()) {
        this.populateMap(node.sections, state);
      }
    });
  }
  private applyTreeState(savedState: Map<number, boolean>) {
    if (!savedState) return;
    this.applyMap(this.treeControl.dataNodes, savedState);
  }
  private applyMap(dataNodes: ContentNode[], savedState: Map<number, boolean>) {
    console.log('dataNodes:', dataNodes);
    if (!dataNodes) return;
    dataNodes?.forEach((node) => {
      if (node.id) {
        if (savedState.get(node.id)) {
          this.treeControl.expand(node);
        } else {
          this.treeControl.collapse(node);
        }
        if (node.isFolder()) {
          this.applyMap(node.subNodes, savedState);
        } else if (node.isContentNode() || node.isContent()) {
          this.applyMap(node.sections, savedState);
        }
      }
    });
  }

  collapseAll(currentNode: ContentNode) {
    this.treeControl.dataNodes = this.dataSource.data;
    this.treeControl.getDescendants(currentNode).forEach((node) => {
      this.treeControl.expand(node);
    });
    this.treeControl.expand(currentNode);
  }

  expandAll(currentNode: ContentNode) {
    this.treeControl.dataNodes = this.dataSource.data;
    this.treeControl.getDescendants(currentNode).forEach((node) => {
      this.treeControl.collapse(node);
    });
    this.treeControl.collapse(currentNode);
  }

  isExpanded(node: ContentNode) {
    return this.treeControl.isExpanded(node);
  }
}
