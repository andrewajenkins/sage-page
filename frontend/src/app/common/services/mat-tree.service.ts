import { Injectable } from '@angular/core';
import { ServiceLogger } from '../logger/loggers';
import { FileTreeComponent } from '../../file-tree-panel/file-tree/file-tree.component';
import { isFile, isFolder } from '../models/file-tree.model';
import { ContentNode, isContent, isSection } from '../models/content-node.model';
import { NodeService } from './node.service';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class MatTreeService {
  private fileTreeComponent!: FileTreeComponent;
  private state!: Map<number, boolean>;

  constructor(private nodeService: NodeService) {}
  registerComponent(component) {
    this.fileTreeComponent = component;
  }
  refreshTree(data?: ContentNode[]) {
    let temp, expandCurrent;
    if (!data || data.length == 0) temp = this.fileTreeComponent.dataSource.data;
    else {
      temp = this.fileTreeComponent.dataSource.data;
      if ((expandCurrent = !this.isRootData(data))) {
        this.insertData(data!, temp);
      } else temp = data;
    }
    this.fileTreeComponent.dataSource.data = [];
    this.fileTreeComponent.dataSource.data = temp!;
    this.fileTreeComponent.treeControl.dataNodes = temp!;
    this.applyTreeState(this.state);
    if (expandCurrent) this.fileTreeComponent.treeControl.expand(this.nodeService.currentNode!);
  }
  insertData(data: ContentNode[], treeData: ContentNode[]) {
    const targetNode = data[0] as ContentNode;
    for (let i = 0; i < treeData.length; i++) {
      if (treeData[i].id === targetNode.id) {
        treeData.splice(i, 1, targetNode);
        return;
      }
    }
    treeData.forEach((node: ContentNode) => {
      if (isFolder(node)) {
        return this.insertData(data, node.subNodes);
      } else if (isSection(node)) {
        return this.insertData(data, node.sections);
      }
    });
  }
  isRootData(data) {
    return !data[0]?.parent_id;
  }
  deleteNode(id) {
    this.fileTreeComponent.dataSource.data;
    this.fileTreeComponent.treeControl.dataNodes = this.fileTreeComponent.treeControl.dataNodes.filter(
      (node) => node.id === id
    );
  }

  saveTreeState() {
    const state = new Map<number, boolean>();
    this.populateMap(this.fileTreeComponent.treeControl.dataNodes, state);
    this.state = state;
  }
  populateMap(dataNodes: ContentNode[], state: Map<number, boolean>) {
    dataNodes?.forEach((node) => {
      state.set(node.id as number, this.fileTreeComponent.treeControl.isExpanded(node));
      if (isFolder(node)) {
        this.populateMap(node.subNodes, state);
      } else if (isFile(node) || isSection(node) || isContent(node)) {
        this.populateMap(node.sections, state);
      }
    });
  }
  applyTreeState(savedState: Map<number, boolean>) {
    if (!savedState) return;
    this.applyMap(this.fileTreeComponent.treeControl.dataNodes, savedState);
  }
  applyMap(dataNodes: ContentNode[], savedState: Map<number, boolean>) {
    console.log('dataNodes:', dataNodes);
    if (!dataNodes) return;
    dataNodes?.forEach((node) => {
      if (node.id) {
        if (savedState.get(node.id)) {
          this.fileTreeComponent.treeControl.expand(node);
        } else {
          this.fileTreeComponent.treeControl.collapse(node);
        }
        if (isFolder(node)) {
          this.applyMap(node.subNodes, savedState);
        } else if (isFile(node) || isSection(node) || isContent(node)) {
          this.applyMap(node.sections, savedState);
        }
      }
    });
  }
}
