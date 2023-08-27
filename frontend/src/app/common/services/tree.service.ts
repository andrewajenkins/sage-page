import { Injectable } from '@angular/core';
import { ServiceLogger } from '../logger/loggers';
import { FileTreeComponent } from '../../file-tree-panel/file-tree/file-tree.component';
import { ContentNode } from '../models/content-node.model';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Tree } from '../models/tree.model';
import { assembleTree, buildMapV2, parseNodes } from '../utils/tree-utils';
import { DataService } from './data.service';
import { StateAction } from '../models/command.model';
import { CommandService } from './command.service';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class TreeService {
  private fileTreeComponent!: FileTreeComponent;
  private state!: Map<number, boolean>;
  private tree!: Tree;
  get nodeMap(): Map<number, ContentNode> {
    return this.tree?.nodeMap;
  }
  set nodeMap(value: Map<number, ContentNode>) {
    this.tree.nodeMap = value;
  }
  get currentNode(): ContentNode | undefined {
    return this.tree?.currentNode;
  }
  set currentNode(value: ContentNode | undefined) {
    this.tree.currentNode = value;
  }
  get previousNode(): any {
    return this.tree?.previousNode;
  }
  set previousNode(value: any) {
    this.tree.previousNode = value;
  }
  constructor(private dataService: DataService, private commandService: CommandService) {}

  registerComponent(
    component,
    dataSource: MatTreeNestedDataSource<ContentNode>,
    treeControl: NestedTreeControl<ContentNode, ContentNode>
  ) {
    this.fileTreeComponent = component;
    this.tree = new Tree(dataSource, treeControl);
    this.dataService.getFileTree().subscribe((fileTree) => {
      const { nodeMap, rootNodes } = assembleTree(fileTree, this.tree.currentNode as ContentNode);
      this.nodeMap = nodeMap;
      for (let node of nodeMap.values()) this.dataService.updateNode(node).subscribe((node) => {});
      this.refreshTree(rootNodes as ContentNode[]);
      const treeControl = this.tree.treeControl;
      if (treeControl.dataNodes && treeControl.dataNodes.length > 0) {
        treeControl.expandAll();
        treeControl.dataNodes?.forEach((node) => {
          treeControl.collapse(node);
        });
      }
    });
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
    if (expandCurrent) this.fileTreeComponent.treeControl.expand(this.tree.currentNode!);
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
      if (node.isFolder()) {
        return this.insertData(data, node.subNodes);
      } else if (node.isSection()) {
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
      if (node.isFolder()) {
        this.populateMap(node.subNodes, state);
      } else if (node.isContentNode() || node.isContent()) {
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
        if (node.isFolder()) {
          this.applyMap(node.subNodes, savedState);
        } else if (node.isContentNode() || node.isContent()) {
          this.applyMap(node.sections, savedState);
        }
      }
    });
  }
  updateNodes() {
    const currentNode = this.tree.currentNode;
    if (!currentNode) return;
    if (!this.hasNewSections(currentNode)) {
      this.commandService.perform({
        action: StateAction.NOTIFY,
        value: 'Nothing to save',
      });
      return;
    }
    if (currentNode.isContentNode()) {
      const parseResult = parseNodes(currentNode as ContentNode);
      const sectionNodes = buildMapV2(parseResult as ContentNode);
      currentNode.sections = sectionNodes;
      console.log('currentNode:', currentNode);
      this.dataService.createSections(currentNode as ContentNode).subscribe((fileTree: any) => {
        const { nodeMap, rootNodes } = assembleTree(fileTree, currentNode as ContentNode);
        this.nodeMap = nodeMap;
        for (let node of nodeMap.values()) this.dataService.updateNode(node).subscribe((node) => {});
        this.refreshTree(rootNodes as ContentNode[]);
      });
    } else
      this.commandService.perform({
        action: StateAction.NOTIFY,
        value: 'Failed to generate sections, current node is not a file or section',
      });
  }
  handleTreeUpdate(resp: any) {
    const { nodeMap, rootNodes } = assembleTree(resp, this.currentNode as ContentNode);
    const tree = [...nodeMap.entries()].map((v, k) => v[1]).filter((node) => node.parent_id == null);
    this.refreshTree(rootNodes as ContentNode[]);
  }
  hasNewSections(node) {
    return !!node.sections?.some((section) => !section.generated);
  }
}
