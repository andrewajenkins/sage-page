import { Injectable } from '@angular/core';
import { ServiceLogger } from '../logger/loggers';
import { FileTreeComponent } from '../../file-tree-panel/file-tree/file-tree.component';
import { ContentNode } from '../models/content-node.model';
import { Tree } from '../models/tree.model';
import { assembleTree, buildMapV2, parseNodes } from '../utils/tree-utils';
import { DataService } from './data.service';
import { StateAction } from '../models/command.model';
import { CommandService } from './command.service';
import { TreeState } from '../models/tree-state.model';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class TreeService {
  private _tree!: Tree;
  private _treeState!: TreeState;
  get nodeMap(): Map<number, ContentNode> {
    return this._tree?.nodeMap;
  }
  set nodeMap(value: Map<number, ContentNode>) {
    this._tree.nodeMap = value;
  }
  get currentNode(): ContentNode | undefined {
    return this._tree?.currentNode;
  }
  set currentNode(value: ContentNode | undefined) {
    this._tree.currentNode = value;
  }
  get previousNode(): any {
    return this._tree?.previousNode;
  }
  set previousNode(value: any) {
    this._tree.previousNode = value;
  }
  get treeState(): TreeState {
    return this._treeState;
  }
  get tree(): Tree {
    return this._tree;
  }

  set tree(value: Tree) {
    this._tree = value;
  }
  set treeState(value: TreeState) {
    this._treeState = value;
  }
  constructor(private dataService: DataService, private commandService: CommandService) {}

  initialize(): Promise<void> {
    this._tree = new Tree();
    this._treeState = new TreeState(this._tree.dataSource, this._tree.treeControl);
    this.dataService.getFileTree().subscribe((fileTree) => {
      const { nodeMap, rootNodes } = assembleTree(fileTree, this._tree.currentNode as ContentNode);
      this.nodeMap = nodeMap;
      for (let node of nodeMap.values()) this.dataService.updateNode(node).subscribe((node) => {});
      this._treeState.refreshTree(rootNodes as ContentNode[]);
      const treeControl = this._tree.treeControl;
      if (treeControl.dataNodes && treeControl.dataNodes.length > 0) {
        treeControl.expandAll();
        treeControl.dataNodes?.forEach((node) => {
          treeControl.collapse(node);
        });
      }
    });
    return Promise.resolve();
  }

  updateNodes() {
    const currentNode = this._tree.currentNode;
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
        this._treeState.refreshTree(rootNodes as ContentNode[]);
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
    this._treeState.refreshTree(rootNodes as ContentNode[]);
  }
  hasNewSections(node) {
    return !!node.sections?.some((section) => !section.generated);
  }

  collapseAll() {
    if (this._tree.currentNode) this.treeState.collapseAll(this._tree.currentNode);
  }

  expandAll() {
    if (this._tree.currentNode) this.treeState.expandAll(this._tree.currentNode);
  }
}
