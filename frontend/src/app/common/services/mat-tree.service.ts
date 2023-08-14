import { Injectable } from '@angular/core';
import { ServiceLogger } from '../logger/loggers';
import { DataService } from './data.service';
import { FileTreeComponent } from '../../file-tree-panel/file-tree/file-tree.component';
import { map } from 'rxjs';
import {
  FileTreeFolder,
  FileTreeNode,
  isFile,
  isFolder,
} from '../models/file-tree.model';
import { ContentSection, isSection } from '../models/section.model';

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
    console.log('refreshTree:', data);
    if (!data) {
      data = this.fileTreeComponent.dataSource.data;
    }
    this.fileTreeComponent.dataSource.data = [];
    this.fileTreeComponent.dataSource.data = data;
  }

  static assembleTree = map((nodes: FileTreeNode[]) => {
    const debug = true;
    const nodeMap = new Map<number, FileTreeNode>();
    const rootNodes: FileTreeNode[] = [];
    console.log('assembleTree: nodes:', nodes);
    nodes.forEach((node) => {
      if (isFolder(node)) {
        node.subNodes = [];
      } else if (isFile(node) || isSection(node)) {
        node.sections = [];
      }
      nodeMap.set(node.id as number, node);
    });
    if (debug) console.log('assembleTree: map:', map);
    nodes.forEach((node) => {
      const findDebug = true;
      if (!node.parent_id) {
        if (findDebug)
          console.log('assembleTree: fine: pushing root node:', node);
        rootNodes.push(node);
      } else if (isFolder(node)) {
        console.log('assembleTree: fine: pushing subNode:', node);
        const parent = nodeMap.get(node.parent_id) as FileTreeFolder;
        parent.subNodes.push(node);
      } else if (isFile(node)) {
        console.log('assembleTree: fine: pushing subNode:', node);
        const parent = nodeMap.get(node.parent_id) as FileTreeFolder;
        parent.subNodes.push(node);
      } else if (isFile(node) || isSection(node)) {
        console.log('assembleTree: fine: pushing subNode:', node);
        const parent = nodeMap.get(node.parent_id) as ContentSection;
        if (!parent.sections) parent.sections = [];
        parent.sections.push(node);
      }
    });
    console.log('assembleTree: final tree:', rootNodes);
    return rootNodes;
  });
}
