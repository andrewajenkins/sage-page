import { Component } from '@angular/core';
import { NodeNameDialog } from '../dialogs/create-file/node-name-dialog.component';
import { ConvoAction } from '../../common/models/command.model';
import { CommandService } from '../../common/services/command.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-conversation-tree-menu',
  templateUrl: './conversation-tree-menu.component.html',
  styleUrls: ['./conversation-tree-menu.component.scss'],
})
export class ConversationTreeMenuComponent {
  nodeNotSelected: any;

  constructor(private commandService: CommandService, public dialog: MatDialog) {}

  createFolder() {
    this.openDialog({
      name: '',
      title: 'Create a conversation folder',
      nodeType: 'folder',
    })
      .afterClosed()
      .subscribe((res) => {
        if (res?.result != 'submit') return;
        this.commandService.perform({
          action: ConvoAction.CREATE_FOLDER,
          value: res.name,
        });
      });
  }

  createConversation() {
    this.openDialog({
      name: '',
      title: 'Create a conversation',
      nodeType: 'convo',
    })
      .afterClosed()
      .subscribe((res) => {
        if (res.result != 'submit') return;
        this.commandService.perform({
          action: ConvoAction.CREATE_CONVO,
          value: res.name,
        });
      });
  }

  editFile() {
    this.openDialog({
      name: '',
      title: 'Create a conversation',
      nodeType: 'file',
    })
      .afterClosed()
      .subscribe((res) => {
        if (res.result != 'submit') return;
        this.commandService.perform({
          action: ConvoAction.EDIT_NODE_NAME,
          value: res.name,
        });
      });
  }

  deleteNode() {
    this.commandService.perform({
      action: ConvoAction.DELETE_CURRENT_NODE,
    });
  }

  expandAll() {}

  collapseAll() {}

  openDialog(data: any) {
    return this.dialog.open(NodeNameDialog, {
      width: '250px',
      data: data,
    });
  }
}
