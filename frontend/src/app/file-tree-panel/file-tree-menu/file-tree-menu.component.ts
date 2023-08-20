import { Component } from '@angular/core';
import { CommandService } from '../../common/services/command.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NodeNameDialog } from '../dialogs/create-file/node-name-dialog.component';
import { isFlagCommand, NodeAction, StateAction } from '../../common/models/command.model';

@Component({
  selector: 'app-file-tree-menu',
  templateUrl: './file-tree-menu.component.html',
  styleUrls: ['./file-tree-menu.component.scss'],
})
export class FileTreeMenuComponent {
  nodeNotSelected: boolean = true;
  constructor(private commandService: CommandService, public dialog: MatDialog) {}

  ngOnInit() {
    this.commandService.action$.subscribe((cmd) => {
      if (isFlagCommand(cmd) && cmd.action === StateAction.SET_NODE_SELECTED) {
        this.nodeNotSelected = !cmd.flag;
      }
    });
  }

  // TODO move dialog stuff to dialog service
  createFolder() {
    this.openDialog({
      name: '',
      title: 'Create a folder',
      nodeType: 'folder',
    })
      .afterClosed()
      .subscribe((name) => {
        this.commandService.perform({
          action: NodeAction.CREATE_FOLDER,
          value: name,
        });
      });
  }

  createFile() {
    this.openDialog({
      name: '',
      title: 'Create a file',
      nodeType: 'file',
    })
      .afterClosed()
      .subscribe((name) => {
        this.commandService.perform({
          action: NodeAction.CREATE_FILE,
          value: name,
        });
      });
  }

  editFile() {
    this.openDialog({
      name: '',
      title: 'Create a new file name',
      nodeType: 'edit',
    })
      .afterClosed()
      .subscribe((name) => {
        this.commandService.perform({
          action: NodeAction.EDIT_NODE_NAME,
          value: name,
        });
      });
  }

  openDialog(data: any) {
    return this.dialog.open(NodeNameDialog, {
      width: '250px',
      data: data,
    });
  }

  deleteNode() {
    this.commandService.perform({
      action: NodeAction.DELETE_CURRENT_NODE,
    });
  }

  collapseAll() {
    this.commandService.perform({
      action: StateAction.COLLAPSE_FILE_TREE_ALL,
    });
  }
}
