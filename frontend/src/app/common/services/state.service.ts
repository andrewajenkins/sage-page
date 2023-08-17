import { Injectable } from '@angular/core';
import { CommandService } from './command.service';
import { isFlagCommand, StateAction } from '../models/command.model';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  autoAdjustHeaderGeneration = true;

  constructor(private commandService: CommandService) {
    this.commandService.action$.subscribe((cmd) => {
      if (
        isFlagCommand(cmd) &&
        cmd.action === StateAction.SET_AUTO_ADJUST_HEADINGS
      ) {
        this.autoAdjustHeaderGeneration = cmd.flag as boolean;
      }
    });
  }
}
