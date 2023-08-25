import {
  isContentCommand,
  isNodeCommand,
  isValueCommand,
  NodeAction,
  StateAction,
} from '../../common/models/command.model';
import { FileTreeFile } from '../../common/models/file-tree.model';
import { CommandService } from '../../common/services/command.service';
import { DataService } from '../../common/services/data.service';
import { Injectable } from '@angular/core';
import { NodeService } from '../../common/services/node.service';
import { MatTreeService } from '../../common/services/mat-tree.service';
import { NodeFactory } from '../../common/utils/node.factory';
import { assembleTree } from '../../common/utils/tree-utils';
import { ContentSection } from '../../common/models/section.model';

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
      this.matTreeService.saveTreeState();
      if (isValueCommand(cmd) && action === NodeAction.CREATE_FOLDER) {
        const currentNode = this.nodeService.hasCurrent() ? this.nodeService.currentNode : undefined;
        const newNode: any = {
          name: cmd.value || '' + this.fileIndex++,
          subNodes: [],
          type: 'folder',
          parent_id: currentNode?.id as number,
        };
        this.dataService.createNode(newNode).subscribe((resp) => {
          this.handleTreeUpdate(resp);
        });
      } else if (isValueCommand(cmd) && action === NodeAction.CREATE_FILE) {
        const currentNode = this.nodeService.currentNode;
        if (!currentNode) return;
        const newNode: FileTreeFile = NodeFactory.createFile({
          name: cmd.value || 'DEFAULT_NAME_' + this.fileIndex++,
          text: cmd.value || 'DEFAULT_NAME_' + this.fileIndex++,
          parent_id: currentNode.id as number,
        });
        this.dataService.createNode(newNode).subscribe((resp) => {
          this.handleTreeUpdate(resp);
        });
      } else if (isContentCommand(cmd) && action === NodeAction.DELETE_NODE) {
        if (this.nodeService.currentNode && cmd.content.id == this.nodeService.currentNode.id)
          this.setNodeNotSelected();
        this.dataService.deleteNode(cmd.content).subscribe((resp) => {
          this.handleTreeUpdate(resp);
        });
      } else if (action === NodeAction.DELETE_CURRENT_NODE) {
        const currentNode = this.nodeService.currentNode;
        if (!currentNode) return;
        this.dataService.deleteNode(currentNode).subscribe((resp) => {
          this.setNodeNotSelected();
          if (this.nodeService.currentNode && this.nodeService.currentNode.id) {
            this.handleTreeUpdate(resp);
            this.nodeService.currentNode = undefined;
            this.commandService.perform({
              action: StateAction.SET_NODE_SELECTED,
              flag: false,
            });
          }
        });
      } else if (isValueCommand(cmd) && action === NodeAction.EDIT_NODE_NAME) {
        if (this.nodeService.currentNode) {
          this.nodeService.currentNode.name = cmd.value;
          this.dataService.updateNode(this.nodeService.currentNode).subscribe((resp) => {});
        }
      } else if (isNodeCommand(cmd) && action === NodeAction.UPDATE_NODE) {
        this.dataService.updateNode(cmd.node).subscribe((resp) => {});
      }
    });
  }
  setNodeNotSelected() {
    this.commandService.perform({
      action: StateAction.SET_NODE_SELECTED,
      // node: currentNode,
      flag: false,
    });
  }
  handleTreeUpdate(resp: any) {
    const { nodeMap, rootNodes } = assembleTree(resp, this.nodeService.currentNode as ContentSection);
    const tree = [...nodeMap.entries()].map((v, k) => v[1]).filter((node) => node.parent_id == null);
    this.matTreeService.refreshTree(rootNodes as ContentSection[]);
  }
}
