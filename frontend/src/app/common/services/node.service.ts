import { Injectable, OnInit } from '@angular/core';
import { CommandService } from './command.service';
import {
  isFileCommand,
  isNodeCommand,
  NodeAction,
  StateAction,
} from '../models/command.model';
import { FileTreeFile, FileTreeNode, isFile } from '../models/file-tree.model';
import { FileTreeBuilderService } from '../parsers/file-tree-builder.service';
import { MatTreeService } from './mat-tree.service';
import { isSection } from '../models/section.model';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
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
    return (
      isFile(this._currentNode) ||
      isSection(this._currentNode) ||
      !!this._currentFile
    );
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
    private fileTreeBuilder: FileTreeBuilderService,
    private commandService: CommandService,
    private matTreeService: MatTreeService
  ) {}

  init() {
    this.commandService.action$.subscribe(async (cmd) => {
      if (cmd.action == NodeAction.GENERATE_FILE_SECTIONS) {
        if (
          this._currentNode &&
          (isFile(this._currentNode) || isSection(this._currentNode))
        ) {
          await this.fileTreeBuilder.generateNodes(this._currentNode);
        } else {
          await this.fileTreeBuilder.generateNodes(this.currentFile);
        }
        this.matTreeService.refreshTree();
      }
    });
    this.commandService.action$.subscribe((cmd) => {
      if (isFileCommand(cmd) && cmd.action == NodeAction.LOAD_FILE) {
        this._currentFile = cmd.file!;
      }
    });
    this.commandService.action$.subscribe((cmd) => {
      if (isNodeCommand(cmd) && cmd.action == StateAction.SET_NODE_SELECTED) {
        this._currentNode = cmd.node!;
      }
    });
  }
  hasCurrent(): boolean {
    return !!this._currentNode;
  }
}
