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
  constructor() {}
  registerComponent(component) {
    this.fileTreeComponent = component;
  }
  refreshTree(data?) {
    if (!data) {
      data = this.fileTreeComponent.dataSource.data;
      console.log('refreshTree: not provided:', cloneDeep(data));
    } else {
      console.log('refreshTree: provided:', cloneDeep(data));
    }
    const previousState = this.saveTreeState();
    this.fileTreeComponent.dataSource.data = [];
    this.fileTreeComponent.dataSource.data = data;
    this.applyTreeState(previousState);
  }

  saveTreeState(): boolean[] {
    return this.fileTreeComponent.treeControl.dataNodes?.map((node) =>
      this.fileTreeComponent.treeControl.isExpanded(node)
    );
  }
  applyTreeState(savedState: boolean[]) {
    this.fileTreeComponent.treeControl.dataNodes?.forEach((node, index) => {
      if (savedState[index]) {
        this.fileTreeComponent.treeControl.expand(node);
      } else {
        this.fileTreeComponent.treeControl.collapse(node);
      }
    });
  }

  static assembleTree = map((nodes: FileTreeNode[]) => {
    const debug = true;
    const nodeMap = new Map<number, FileTreeNode>();
    const rootNodes: FileTreeNode[] = [];
    console.log('assembleTree: nodes:', nodes);
    nodes.forEach((node) => {
      if (isFolder(node)) {
        node.subNodes = [];
      } else if (isFile(node) || isSection(node) || isContent(node)) {
        node.sections = [];
        node.content = [];
      }
      nodeMap.set(node.id as number, node);
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
        console.log('assembleTree: pushing folder or file:', node);
        const parent = nodeMap.get(node.parent_id) as FileTreeFolder;
        parent.subNodes.push(node);
      } else if (isFile(node)) {
        console.log('assembleTree: pushing file:', node);
        const parent = nodeMap.get(node.parent_id) as FileTreeFolder;
        parent.subNodes.push(node);
      } else if (node.type === 'content') {
        console.log('assembleTree: pushing content:', node);
        const parent = nodeMap.get(node.parent_id) as ContentSection;
        if (!parent.content) parent.content = [];
        parent.content.push(node);
      } else if (node.type == 'heading' || isSection(node)) {
        console.log('assembleTree: pushing section:', node);
        const parent = nodeMap.get(node.parent_id) as ContentSection;
        if (!parent.sections) parent.sections = [];
        parent.sections.push(node);
      } else {
        console.error('assembleTree: unknown node type:', node);
      }
    });
    console.log('assembleTree: final tree:', rootNodes);
    return rootNodes;
  });
}
