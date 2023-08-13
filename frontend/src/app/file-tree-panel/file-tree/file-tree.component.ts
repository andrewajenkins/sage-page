import { Component } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { CommandService } from '../../common/services/command.service';
import { DataService } from '../../common/services/data.service';
import { ComponentLogger } from '../../common/logger/loggers';
import {
  FileTreeFolder,
  FileTreeNode,
  isFile,
  isFolder,
} from '../../common/models/file-tree.model';
import { FileTreeActionHandler } from './file-tree-action-handler';
import { StateAction } from '../../common/models/command.model';

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
})
@ComponentLogger()
export class FileTreeComponent {
  treeControl = new NestedTreeControl<FileTreeNode>(
    (node) => (node as FileTreeFolder).subNodes
  );
  dataSource = new MatTreeNestedDataSource<FileTreeNode>();

  // element node references
  highlightElement!: HTMLElement | undefined;
  highlightNode!: FileTreeNode | undefined;
  currentElement!: HTMLElement;

  _currentNode!: FileTreeNode;
  set currentNode(node) {
    this._currentNode = node;
    this.commandService.perform({
      action: StateAction.SET_NODE_SELECTED,
      flag: true,
    });
  }
  get currentNode() {
    return this._currentNode;
  }

  // TODO temp remove
  constructor(
    private commandService: CommandService,
    private dataService: DataService,
    private actionHandler: FileTreeActionHandler
  ) {
    this.actionHandler.registerComponent(this);
  }

  ngOnInit() {
    this.dataService.getFileTree().subscribe((fileTree) => {
      this.refreshTree(fileTree);
      this.treeControl.dataNodes = this.dataSource.data;
    });
  }

  hasSub = (_: number, node: FileTreeFolder) => isFolder(node);

  refreshTree(data?) {
    console.log('refreshTree:', data);
    if (!data) {
      data = this.dataSource.data;
    }
    this.dataSource.data = [];
    this.dataSource.data = data;
  }

  nodeHighlight(event: MouseEvent, newNode: FileTreeNode) {
    const previousNode = this.highlightNode;
    const currentNode = this.currentNode;

    if (newNode.id === previousNode?.id) return;

    if (
      this.highlightElement &&
      previousNode &&
      previousNode.id !== currentNode?.id
    )
      this.highlightElement.style.backgroundColor = 'white';

    this.highlightElement = event.target as HTMLElement;
    this.highlightNode = newNode;

    if (this.highlightElement && newNode.id !== currentNode?.id)
      this.highlightElement.style.backgroundColor = 'whitesmoke';
  }

  nodeSelect(event: MouseEvent, node: FileTreeNode) {
    // update styles and statuses for selected node
    this.currentNode = node;
    if (this.currentElement)
      this.currentElement.style.backgroundColor = 'white';
    this.currentElement = event.target as HTMLElement;
    this.currentElement.style.backgroundColor =
      'var(--mat-standard-button-toggle-selected-state-background-color)';

    if (isFile(node)) {
      this.commandService.loadFile(node.id as number);
      this.commandService.perform({
        action: StateAction.SET_FILE_SELECTED,
        flag: true,
      });
    }
  }

  nodeUnHighlight($event: MouseEvent, previousNode: FileTreeNode) {
    if (
      this.highlightElement &&
      previousNode &&
      previousNode.id !== this.currentNode?.id
    )
      this.highlightElement.style.backgroundColor = 'white';
    this.highlightNode = undefined;
    this.highlightElement = undefined;
  }

  getClass(node: FileTreeNode) {
    return this.currentElement && node.id === this.currentNode.id;
  }
}
