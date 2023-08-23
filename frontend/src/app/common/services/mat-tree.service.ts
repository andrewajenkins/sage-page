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

  constructor() {}
  registerComponent(component) {
    this.fileTreeComponent = component;
  }
  refreshTree(data?) {
    if (!data) {
      data = this.fileTreeComponent.dataSource.data;
    }
    // const state: Map<number, boolean> = this.saveTreeState();
    const temp = data;
    this.fileTreeComponent.dataSource.data = [];
    this.fileTreeComponent.dataSource.data = temp;
    this.fileTreeComponent.treeControl.dataNodes = temp;
    this.applyTreeState(this.state);
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
