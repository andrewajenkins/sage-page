import { Injectable, OnInit } from '@angular/core';
import { CommandService } from './command.service';
import {
  isFileCommand,
  NodeAction,
  StateAction,
} from '../models/command.model';
import { FileTreeFile, FileTreeNode, isFile } from '../models/file-tree.model';
import { FileTreeBuilderService } from '../parsers/file-tree-builder.service';
import { MatTreeService } from './mat-tree.service';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  get currentNode(): FileTreeNode {
    return this._currentNode;
  }

  set currentNode(value: FileTreeNode) {
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
  private _currentNode!: FileTreeNode;
  get currentFile(): FileTreeFile {
    return this._currentFile;
  }

  set currentFile(value: FileTreeFile) {
    this._currentFile = value;
  }
  private _currentFile!: FileTreeFile;
  constructor(
    private fileTreeBuilder: FileTreeBuilderService,
    private commandService: CommandService,
    private matTreeService: MatTreeService
  ) {}

  init() {
    this.commandService.action$.subscribe(async (cmd) => {
      if (cmd.action == NodeAction.GENERATE_FILE_SECTIONS) {
        await this.fileTreeBuilder.generateNodes(this.currentFile);
        this.matTreeService.refreshTree();
      }
    });
    this.commandService.action$.subscribe((cmd) => {
      if (isFileCommand(cmd) && cmd.action == NodeAction.LOAD_FILE) {
        this._currentFile = cmd.file!;
      }
    });
  }
}
