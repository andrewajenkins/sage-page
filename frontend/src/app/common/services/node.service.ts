import { Injectable } from '@angular/core';
import { CommandService } from './command.service';
import { StateAction } from '../models/command.model';
import { FileTreeFile, FileTreeNode, isFile } from '../models/file-tree.model';
import { ContentSection, isSection } from '../models/section.model';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
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
    // private fileTreeBuilder: FileTreeBuilderService,
    private commandService: CommandService
  ) {}

  hasCurrent(): boolean {
    return !!this._currentNode;
  }
}
