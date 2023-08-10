import { Component } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import {
  Action,
  Command,
  CommandService,
} from '../../common/services/command.service';
import { DataService } from '../../common/services/data.service';
import { ContentSection } from '../../main-content/bot-window/bot-window.component';
import { Loggers } from '../../common/logger/loggers';

export interface NodeType {
  FILE;
  FOLDER;
}

export interface FileTreeFolder extends Object {
  id?: number;
  name: string;
  parent_id: number;
  parent_type: string;
  type: string;
  subNodes: FileTreeNode[]; // uid's of sub-nodes
}
export interface FileTreeFile {
  id?: number;
  name: string;
  parent_id: number;
  parent_type: string;
  type: string;
  content: ContentSection[];
}

export type FileTreeNode = FileTreeFolder | FileTreeFile;

export function isFolder(node: FileTreeNode): node is FileTreeFolder {
  return node && node.type === 'folder';
}

export function isFile(node: FileTreeNode): node is FileTreeFile {
  return node && node.type === 'file';
}

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
})
@Loggers()
export class FileTreeComponent {
  treeControl = new NestedTreeControl<FileTreeNode>(
    (node) => (node as FileTreeFolder).subNodes
  );
  dataSource = new MatTreeNestedDataSource<FileTreeNode>();

  // element node references
  highlightElement!: HTMLElement | undefined;
  highlightNode!: FileTreeNode | undefined;
  currentElement!: HTMLElement;
  currentNode!: FileTreeNode;

  // TODO temp remove
  fileIndex = 0;
  constructor(
    private commandService: CommandService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService.getFileTree().subscribe((fileTree) => {
      this.refreshTree(fileTree);
      this.treeControl.dataNodes = this.dataSource.data;
    });
    this.commandService.action$.subscribe((command: Command<Action>) => {
      const action = command.action;
      if (action === Action.CREATE_FOLDER) {
        const newNode: FileTreeFolder = {
          name: command.value || '' + this.fileIndex++,
          subNodes: [],
          type: 'folder',
          parent_id: this.currentNode?.id as number,
          parent_type: this.currentNode?.type as string,
        };
        this.dataService.setNode(newNode).subscribe((resp) => {});
      } else if (action === Action.CREATE_FILE) {
        const targetNode = isFolder(this.currentNode)
          ? this.currentNode
          : this.currentNode?.parent_id;
        const newNode: FileTreeFile = {
          type: 'file',
          name: command.value || '' + this.fileIndex++,
          parent_id: isFolder(this.currentNode)
            ? (this.currentNode.id as number)
            : (this.currentNode.parent_id as number),
          parent_type: isFolder(this.currentNode)
            ? this.currentNode.type
            : this.currentNode.parent_type,
          content: [],
        };
        this.dataService.setNode(newNode).subscribe((resp) => {
          this.refreshTree(resp);
        });
      } else if (action === Action.EDIT_NODE_NAME) {
        if (this.currentNode) {
          this.currentNode.name = command.value || '' + this.fileIndex++;
          this.refreshTree();
        }
      } else if (action === Action.DELETE_NODE) {
        this.dataService.deleteNode(this.currentNode).subscribe((resp) => {
          this.refreshTree(resp);
        });
      }
    });
  }

  refreshTree(data?) {
    console.log('refreshTree:', data);
    if (!data) {
      data = this.dataSource.data;
    }
    this.dataSource.data = [];
    this.dataSource.data = data;
  }

  hasSub = (_: number, node: FileTreeFolder) => isFolder(node);

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
