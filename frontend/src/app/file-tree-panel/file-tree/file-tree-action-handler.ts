import {
  isNodeCommand,
  isValueCommand,
  NodeAction,
  StateAction,
} from '../../common/models/command.model';
import {
  dummyNode,
  FileTreeFile,
  FileTreeFolder,
  isFolder,
} from '../../common/models/file-tree.model';
import { CommandService } from '../../common/services/command.service';
import { DataService } from '../../common/services/data.service';
import { Injectable } from '@angular/core';
import { NodeService } from '../../common/services/node.service';
import { MatTreeService } from '../../common/services/mat-tree.service';

@Injectable({
  providedIn: 'root',
})
export class FileTreeActionHandler {
  fileIndex = 0;

  constructor(
    private commandService: CommandService,
    private dataService: DataService,
    private nodeService: NodeService,
    private matTreeService: MatTreeService
  ) {}
  init() {
    this.commandService.action$.subscribe((cmd) => {
      const action = cmd.action;

      if (isValueCommand(cmd) && action === NodeAction.CREATE_FOLDER) {
        const currentNode = this.nodeService.hasCurrent()
          ? this.nodeService.currentNode
          : undefined;
        const newNode: FileTreeFolder = {
          name: cmd.value || '' + this.fileIndex++,
          subNodes: [],
          type: 'folder',
          parent_id: currentNode?.id as number,
          parent_type: currentNode?.type as string,
        };
        this.dataService.createNode(newNode).subscribe((resp) => {
          this.matTreeService.refreshTree(resp);
        });
      } else if (isValueCommand(cmd) && action === NodeAction.CREATE_FILE) {
        const currentNode = this.nodeService.currentNode;
        if (!currentNode) return;
        const newNode: FileTreeFile = {
          type: 'file',
          name: cmd.value || '' + this.fileIndex++,
          text: [cmd.value || '' + this.fileIndex++],
          parent_id: isFolder(currentNode)
            ? (currentNode.id as number)
            : (currentNode.parent_id as number),
          parent_type: isFolder(currentNode)
            ? currentNode.type
            : currentNode.parent_type,
          sections: [],
          content: [],
        };
        this.dataService.createNode(newNode).subscribe((resp) => {
          this.matTreeService.refreshTree(resp);
        });
      } else if (action === NodeAction.DELETE_NODE) {
        const currentNode = this.nodeService.currentNode;
        if (!currentNode) return;
        this.dataService.deleteNode(currentNode).subscribe((resp) => {
          // if (!currentNode.parent_id) {
          this.nodeService.currentNode = undefined;
          // }
          this.commandService.perform({
            action: StateAction.SET_NODE_SELECTED,
            // node: currentNode,
            flag: false,
          });
          this.matTreeService.refreshTree(resp);
        });
      }
    });
  }
}
