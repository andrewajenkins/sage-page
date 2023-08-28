import {
  isContentCommand,
  isNodeCommand,
  isValueCommand,
  NodeAction,
  StateAction,
} from '../../common/models/command.model';
import { CommandService } from '../../common/services/command.service';
import { DataService } from '../../common/services/data.service';
import { Injectable } from '@angular/core';
import { TreeService } from '../../common/services/tree.service';
import { ContentNode } from '../../common/models/content-node.model';

@Injectable({
  providedIn: 'root',
})
export class FileTreeActionHandler {
  fileIndex = 0;

  constructor(
    private commandService: CommandService,
    private dataService: DataService,
    private treeService: TreeService
  ) {}
  init() {
    this.commandService.action$.subscribe((cmd) => {
      const action = cmd.action;
      this.treeService.treeState.saveTreeState();
      const currentNode = this.treeService.currentNode;
      if (isValueCommand(cmd) && action === NodeAction.CREATE_FOLDER) {
        const newNode: ContentNode = new ContentNode({
          name: cmd.value || '' + this.fileIndex++,
          subNodes: [],
          type: 'folder',
          parent_id: currentNode?.feId,
        });
        this.treeService.createNode(newNode);
      } else if (isValueCommand(cmd) && action === NodeAction.CREATE_FILE) {
        if (!currentNode)
          return this.commandService.perform({
            action: StateAction.NOTIFY,
            value: 'Create file failed because no folder selected',
          });
        const newNode: ContentNode = new ContentNode({
          name: cmd.value || 'DEFAULT_NAME_' + this.fileIndex++,
          text: cmd.value || 'DEFAULT_NAME_' + this.fileIndex++,
          parent_id: currentNode.feId,
          depth: 0,
          type: 'file',
        });
        this.treeService.createNode(newNode);
      } else if (isContentCommand(cmd) && action === NodeAction.DELETE_NODE) {
        if (this.treeService.currentNode && cmd.content.feId == currentNode?.feId) this.setNodeNotSelected();
        this.dataService.deleteNode(cmd.content).subscribe((resp) => {
          this.treeService.deleteNode(cmd.content);
        });
      } else if (action === NodeAction.DELETE_CURRENT_NODE) {
        if (!currentNode) return;
        this.dataService.deleteNode(currentNode).subscribe((resp) => {
          this.setNodeNotSelected();
          this.treeService.deleteNode(currentNode);
          this.commandService.perform({
            action: StateAction.SET_NODE_SELECTED,
            flag: false,
          });
        });
      } else if (isValueCommand(cmd) && action === NodeAction.EDIT_NODE_NAME) {
        if (currentNode) {
          currentNode.name = cmd.value;
          this.dataService.updateNode(currentNode).subscribe((resp) => {});
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
}
