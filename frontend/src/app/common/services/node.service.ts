import { Injectable } from '@angular/core';
import { CommandService } from './command.service';
import { NodeAction, StateAction } from '../models/command.model';
import { FileTreeFile, FileTreeNode, isFile, isFolder } from '../models/file-tree.model';
import { ContentSection, isSection } from '../models/section.model';
import { DataService } from './data.service';
import { MatTreeService } from './mat-tree.service';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  private _nodeMap!: Map<number, FileTreeNode>;
  get nodeMap(): Map<number, FileTreeNode> {
    return this._nodeMap;
  }
  set nodeMap(value: Map<number, FileTreeNode>) {
    this._nodeMap = value;
  }
  prev!: FileTreeNode | undefined;
  private _currentNode!: FileTreeNode | undefined;
  get currentNode(): FileTreeNode | undefined {
    return this._currentNode;
  }
  set currentNode(value: FileTreeNode | undefined) {
    this._currentNode = value;
    if (isFile(this._currentNode)) {
      this.currentFile = this._currentNode;
    }
    this.commandService.perform({
      action: StateAction.SET_NODE_SELECTED,
      node: this._currentNode,
      flag: true,
    });
  }
  acceptsContent() {
    if (!this._currentNode) {
      return false;
    }
    return isFile(this._currentNode) || isSection(this._currentNode) || !!this._currentFile;
  }
  private _currentFile!: FileTreeFile;
  get currentFile(): FileTreeFile {
    return this._currentFile;
  }
  set currentFile(value: FileTreeFile) {
    this._currentFile = value;
    this.commandService.perform({
      action: StateAction.SET_FILE_SELECTED,
      flag: true,
    });
  }
  constructor(
    private commandService: CommandService,
    private dataService: DataService,
    private matTreeService: MatTreeService
  ) {}
  init() {
    this.commandService.action$.subscribe(async (cmd) => {
      if (cmd.action == NodeAction.GENERATE_FILE_SECTIONS) {
        const currentNode = this.currentNode;
        if (currentNode && (isFile(currentNode) || isSection(currentNode))) {
          this.dataService.createSections(currentNode as ContentSection).subscribe((resp) => {
            this.matTreeService.refreshTree(resp.tree);
          });
        } else
          this.commandService.perform({
            action: StateAction.NOTIFY,
            value: 'Failed to generate sections, current node is not a file or section',
          });
      }
    });
  }
  hasCurrent(): boolean {
    return !!this._currentNode;
  }
}
