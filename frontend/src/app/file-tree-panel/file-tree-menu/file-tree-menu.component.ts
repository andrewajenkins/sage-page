import { Component } from '@angular/core';
import { CommandService } from '../../common/services/command.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NodeNameDialog } from '../dialogs/create-file/node-name-dialog.component';
import {
  StateAction,
  UiStateManager,
} from '../../common/services/ui-state-manager.service';

@Component({
  selector: 'app-file-tree-menu',
  templateUrl: './file-tree-menu.component.html',
  styleUrls: ['./file-tree-menu.component.scss'],
})
export class FileTreeMenuComponent {
  nodeNotSelected: boolean = true;
  constructor(
    private toolbarService: CommandService,
    public dialog: MatDialog,
    public uiStateService: UiStateManager
  ) {}

  ngOnInit() {
    this.uiStateService.uiState$.subscribe((state) => {
      if (state.action === StateAction.SET_NODE_SELECTED) {
        this.nodeNotSelected = !state.flag;
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
        this.toolbarService.createFolder(name);
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
        this.toolbarService.createFile(name);
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
        this.toolbarService.editFileName(name);
      });
  }

  openDialog(data: any) {
    return this.dialog.open(NodeNameDialog, {
      width: '250px',
      data: data,
    });
  }

  deleteNode() {
    this.toolbarService.deleteNode();
  }
}
