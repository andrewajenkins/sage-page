import { Injectable } from '@angular/core';
import { ServiceLogger } from '../logger/loggers';
import { FileTreeComponent } from '../../file-tree-panel/file-tree/file-tree.component';
import { map } from 'rxjs';
import { FileTreeFolder, FileTreeNode, isFile, isFolder } from '../models/file-tree.model';
import { ContentSection, isContent, isSection } from '../models/section.model';
import { cloneDeep } from 'lodash';
import { NodeService } from './node.service';
import { CommandService } from './command.service';
import { NodeAction, StateAction } from '../models/command.model';
import { DataService } from './data.service';

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
  refreshTree(data?: ContentSection[]) {
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
  insertData(data: FileTreeNode[], treeData: FileTreeNode[]) {
    const targetNode = data[0] as ContentSection;
    for (let i = 0; i < treeData.length; i++) {
      if (treeData[i].id === targetNode.id) {
        treeData.splice(i, 1, targetNode);
        return;
      }
    }
    treeData.forEach((node) => {
      if (isFolder(node)) {
        return this.insertData(data, node.subNodes);
      } else if (isFile(node) || isSection(node) || isContent(node)) {
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
  populateMap(dataNodes: FileTreeNode[], state: Map<number, boolean>) {
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
  applyMap(dataNodes: FileTreeNode[], savedState: Map<number, boolean>) {
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
