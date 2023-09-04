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
    if (!data || data.length == 0) data = this.dataSource.data; //, expandCurrent;
    this.dataSource.data = [];
    this.dataSource.data = data!;
    this.treeControl.dataNodes = data!;
    this.applyTreeState(this.state);
  }

  isRootData(data) {
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
  expandNode(node: ContentNode) {
    this.treeControl.dataNodes = this.dataSource.data;
    this.treeControl.collapse(node);
  }
  isExpanded(node: ContentNode) {
    return this.treeControl.isExpanded(node);
  }
}
