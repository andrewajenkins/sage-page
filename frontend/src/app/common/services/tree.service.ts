import { Injectable } from '@angular/core';
import { ServiceLogger } from '../logger/loggers';
import { ContentNode } from '../models/content-node.model';
import { Tree } from '../models/tree.model';
import { DataService } from './data.service';
import { StateAction } from '../models/command.model';
import { CommandService } from './command.service';
import { TreeState } from '../models/tree-state.model';
import { TreeBuilderV6Service } from './tree-builder-v6.service';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class TreeService {
  private _tree!: Tree;
  private _treeState!: TreeState;
  get nodeMap(): Map<string, ContentNode> {
    return this._tree?.nodeMap;
  }
  set nodeMap(value: Map<string, ContentNode>) {
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
  constructor(
    private dataService: DataService,
    private commandService: CommandService,
    private treeBuilder: TreeBuilderV6Service
  ) {}

  initialize(): Promise<void> {
    this._tree = new Tree();
    this._treeState = new TreeState(this._tree.dataSource, this._tree.treeControl);
    this.dataService.getFileTree().subscribe((fileTree) => {
      const { nodeMap, rootNodes } = this.treeBuilder.assembleTree(fileTree, this.currentNode);
      this.nodeMap = nodeMap;
      // for (let node of nodeMap.values()) this.dataService.updateNode(node).subscribe((node) => {});
      this._treeState.refreshTree(rootNodes as ContentNode[]);
      // const treeControl = this._tree.treeControl;
      // if (treeControl.dataNodes && treeControl.dataNodes.length > 0) {
      //   treeControl.expandAll();
      //   treeControl.dataNodes?.forEach((node) => {
      //     treeControl.collapse(node);
      //   });
      // }
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
      // const parseResult = parseNodes(currentNode as ContentNode);
      // const sectionNodes = buildMapV2(parseResult as ContentNode);
      const { rootNodes } = this.treeBuilder.buildTree(currentNode, cloneDeep(currentNode.sections));
      currentNode.sections = rootNodes;
      console.log('currentNode:', currentNode);
      this.dataService.createSections(currentNode.sections).subscribe((fileTree: any) => {
        const { nodeMap, rootNodes } = this.treeBuilder.assembleTree(fileTree, currentNode);
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
    const { nodeMap, rootNodes } = this.treeBuilder.assembleTree(resp, this.currentNode);
    this._tree.insert(rootNodes, this.currentNode);
    this._treeState.refreshTree();
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
