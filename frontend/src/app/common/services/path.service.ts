import { Injectable } from '@angular/core';
import { CommandService } from './command.service';
import { FileTreeNode } from '../models/file-tree.model';

@Injectable({
  providedIn: 'root',
})
export class PathService {
  private _currentPath: FileTreeNode[] = [];
  private _currentIndex = 0;
  get currentPath(): FileTreeNode[] {
    return this._currentPath;
  }
  set currentPath(path: FileTreeNode[]) {
    this._currentPath = path;
  }
  constructor(private commandService: CommandService) {}
  pathTo(node: FileTreeNode) {
    this._currentPath.push(node);
    this._currentIndex++;
  }
  pathForward() {
    return this._currentPath[this._currentIndex++];
  }
  pathBackward() {
    return this._currentPath[--this._currentIndex];
  }
}
