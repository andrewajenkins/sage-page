import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommandService } from './command.service';
import { isValueCommand, StateAction } from '../models/command.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _snackBar: MatSnackBar, private commandService: CommandService) {}

  init() {
    this.commandService.action$.subscribe((cmd) => {
      if (isValueCommand(cmd) && cmd.action == StateAction.NOTIFY) {
        this._snackBar.open(cmd.value, 'Close', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    });
  }
}
