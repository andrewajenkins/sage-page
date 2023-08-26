import { Injectable } from '@angular/core';
import { CommandService } from './command.service';
import { ContentNode } from '../models/file-tree.model';

@Injectable({
  providedIn: 'root',
})
export class PathService {
  private _currentPath: ContentNode[] = [];
  private _currentIndex = 0;
  get currentPath(): ContentNode[] {
    return this._currentPath;
  }
  set currentPath(path: ContentNode[]) {
    this._currentPath = path;
  }
  constructor(private commandService: CommandService) {}
  pathTo(node: ContentNode) {
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
