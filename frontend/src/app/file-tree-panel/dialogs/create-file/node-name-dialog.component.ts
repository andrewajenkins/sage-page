import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface NodeNameDialogData {
  name: string;
}

@Component({
  selector: 'app-node-name-dialog',
  templateUrl: './node-name-dialog.component.html',
  styleUrls: ['./node-name-dialog.component.scss'],
})
export class NodeNameDialog {
  nodeType: any;
  title: any;
  constructor(
    public dialogRef: MatDialogRef<NodeNameDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NodeNameDialogData,
  ) {}
  submitName() {
    this.dialogRef.close(this.data.name);
    return this.data.name;
  }
}
