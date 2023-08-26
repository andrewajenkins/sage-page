import { Injectable } from '@angular/core';
import { CommandService } from './command.service';
import { StateAction } from '../models/command.model';
import { isContentNode, isFile } from '../models/file-tree.model';
import { ContentNode, isSection } from '../models/section.model';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  private _nodeMap!: Map<number, ContentNode>;
  get nodeMap(): Map<number, ContentNode> {
    return this._nodeMap;
  }
  set nodeMap(value: Map<number, ContentNode>) {
    this._nodeMap = value;
  }
  prev!: ContentNode | undefined;
  private _currentNode!: ContentNode | undefined;
  get currentNode(): ContentNode | undefined {
    return this._currentNode;
  }
  private _currentFile!: ContentNode;
  set currentNode(value: ContentNode | undefined) {
    this._currentNode = value;
    if (isContentNode(this._currentNode) && isFile(this._currentNode)) {
      this.currentFile = this._currentNode;
    }
    this.commandService.perform({
      action: StateAction.SET_NODE_SELECTED,
      node: this._currentNode,
      flag: true,
    });
  }
  get currentFile(): ContentNode {
    return this._currentFile;
  }
  acceptsContent() {
    if (!this._currentNode) {
      return false;
    }
    return isFile(this._currentNode) || isSection(this._currentNode) || !!this._currentFile;
  }

  set currentFile(value: ContentNode) {
    this._currentFile = value;
    this.commandService.perform({
      action: StateAction.SET_FILE_SELECTED,
      flag: true,
    });
  }
  constructor(private commandService: CommandService) {}

  hasCurrent(): boolean {
    return !!this._currentNode;
  }
}
