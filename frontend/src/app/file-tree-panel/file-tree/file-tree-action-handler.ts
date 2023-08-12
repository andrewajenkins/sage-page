import { UiStateManager } from '../../common/services/ui-state-manager.service';
import {
  BaseAction,
  Command,
  isNodeCommand,
  isValueCommand,
  NodeAction,
  StateAction,
  ValueCommand,
} from '../../common/models/command.model';
import {
  dummyNode,
  FileTreeFile,
  FileTreeFolder,
  FileTreeNode,
  isFolder,
} from '../../common/models/file-tree.model';
import { CommandService } from '../../common/services/command.service';
import { DataService } from '../../common/services/data.service';
import { FileTreeComponent } from './file-tree.component';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileTreeActionHandler {
  fileIndex = 0;

  private currentNode!: FileTreeNode;
  private dataSource!: MatTreeNestedDataSource<FileTreeNode>;
  private refreshTree!: (data?) => void;
  private component!: FileTreeComponent;

  constructor(
    private uiService: UiStateManager,
    private commandService: CommandService,
    private dataService: DataService
  ) {
    this.commandService.action$.subscribe((cmd) => {
      if (isNodeCommand(cmd) && cmd.action == StateAction.SET_NODE_SELECTED) {
        this.currentNode = cmd.node!;
      }
    });
    this.commandService.action$.subscribe((cmd) => {
      const action = cmd.action;
      if (isValueCommand(cmd) && action === NodeAction.CREATE_FOLDER) {
        const newNode: FileTreeFolder = {
          name: cmd.value || '' + this.fileIndex++,
          subNodes: [],
          type: 'folder',
          parent_id: this.currentNode?.id as number,
          parent_type: this.currentNode?.type as string,
        };
        this.dataService.createNode(newNode).subscribe((resp) => {
          this.refreshTree(resp);
        });
      } else if (isValueCommand(cmd) && action === NodeAction.CREATE_FILE) {
        const targetNode = isFolder(this.currentNode)
          ? this.currentNode
          : this.currentNode?.parent_id;
        const newNode: FileTreeFile = {
          type: 'file',
          name: cmd.value || '' + this.fileIndex++,
          parent_id: isFolder(this.currentNode)
            ? (this.currentNode.id as number)
            : (this.currentNode.parent_id as number),
          parent_type: isFolder(this.currentNode)
            ? this.currentNode.type
            : this.currentNode.parent_type,
          content: [],
        };
        this.dataService.createNode(newNode).subscribe((resp) => {
          this.refreshTree(resp);
        });
      } else if (isValueCommand(cmd) && action === NodeAction.EDIT_NODE_NAME) {
        if (this.currentNode?.id) {
          this.currentNode.name =
            cmd.value || 'DEFAULT_NAME_' + this.fileIndex++;
          this.refreshTree();
        }
      } else if (action === NodeAction.DELETE_NODE) {
        this.dataService.deleteNode(this.currentNode).subscribe((resp) => {
          if (!this.currentNode.parent_id) {
            this.currentNode = dummyNode;
          }
          this.uiService.nodeSelected(false);
          this.refreshTree(resp);
        });
      }
    });
  }

  registerComponent(fileTreeComponent: FileTreeComponent) {
    this.dataSource = fileTreeComponent.dataSource;
    this.refreshTree = fileTreeComponent.refreshTree;
    this.currentNode = fileTreeComponent.currentNode;
    this.component = fileTreeComponent;
  }
}
