import { Injectable } from '@angular/core';
import { ServiceLogger } from '../logger/loggers';
import { FileTreeComponent } from '../../file-tree-panel/file-tree/file-tree.component';
import { map } from 'rxjs';
import { FileTreeFolder, FileTreeNode, isFile, isFolder } from '../models/file-tree.model';
import { ContentSection, isContent, isSection } from '../models/section.model';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class MatTreeService {
  private fileTreeComponent!: FileTreeComponent;
  private state!: Map<number, boolean>;
  private _nodeMap!: Map<number, FileTreeNode>;
  get nodeMap(): Map<number, FileTreeNode> {
    return this._nodeMap;
  }

  set nodeMap(value: Map<number, FileTreeNode>) {
    this._nodeMap = value;
  }
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

  assembleTree = map((nodes: FileTreeNode[]) => {
    const debug = false;
    this._nodeMap = new Map<number, FileTreeNode>();
    const rootNodes: FileTreeNode[] = [];
    if (debug) console.log('assembleTree: nodes:', nodes);
    nodes.forEach((node) => {
      if (isFolder(node)) {
        node.subNodes = [];
      } else if (isFile(node) || isSection(node) || isContent(node)) {
        node.sections = [];
        node.content = [];
      }
      this._nodeMap.set(node.id as number, node);
    });
    if (debug) console.log('assembleTree: map:', map);
    nodes.forEach((node: FileTreeNode) => {
      const findDebug = true;
      node.generated = true;
      node.name = node.name.replace(/^[#]+\s/, '');
      if (!node.parent_id) {
        if (findDebug) console.log('assembleTree: pushing root node:', node);
        rootNodes.push(node);
      } else if (isFolder(node)) {
        if (findDebug) console.log('assembleTree: pushing folder or file:', node);
        const parent = this._nodeMap.get(node.parent_id) as FileTreeFolder;
        parent.subNodes.push(node);
      } else if (isFile(node)) {
        if (findDebug) console.log('assembleTree: pushing file:', node);
        const parent = this._nodeMap.get(node.parent_id) as FileTreeFolder;
        parent.subNodes.push(node);
      } else if (node.type === 'content') {
        if (findDebug) console.log('assembleTree: pushing content:', node);
        const parent = this._nodeMap.get(node.parent_id) as ContentSection;
        if (!parent.content) parent.content = [];
        parent.content.push(node);
      } else if (node.type == 'heading' || isSection(node)) {
        if (findDebug) console.log('assembleTree: pushing section:', node);
        const parent = this._nodeMap.get(node.parent_id) as ContentSection;
        if (!parent.sections) parent.sections = [];
        parent.sections.push(node);
      } else {
        console.error('assembleTree: unknown node type:', node);
      }
    });
    console.log('assembleTree: final tree:', rootNodes);
    return rootNodes;
  });

  getPath(node: FileTreeNode) {
    let curr: FileTreeNode = node;
    const path: FileTreeNode[] = [];
    while (!isFolder(curr)) {
      console.log('getPath: curr:', curr);
      path.unshift(curr);
      curr = this._nodeMap.get(curr.parent_id) as FileTreeNode;
    }
    return path;
  }
}
