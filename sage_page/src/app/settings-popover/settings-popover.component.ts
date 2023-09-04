import { Component } from '@angular/core';
import { StateAction } from '../common/models/command.model';
import { CommandService } from '../common/services/command.service';

@Component({
  selector: 'app-settings-popover',
  templateUrl: './settings-popover.component.html',
  styleUrls: ['./settings-popover.component.scss'],
})
export class SettingsPopoverComponent {
  isWikiRight!: boolean;
  adjustHeadingGeneration: boolean = true;
  editorLeft: boolean = false;

  constructor(private commandService: CommandService) {}

  toggleEditorLeft() {
    this.editorLeft = !this.editorLeft;
    this.commandService.perform({
      action: StateAction.SET_EDITOR_LEFT,
      flag: this.editorLeft,
    });
  }

  toggleAdjustHeading() {
    this.adjustHeadingGeneration = !this.adjustHeadingGeneration;
    this.commandService.perform({
      action: StateAction.SET_AUTO_ADJUST_HEADINGS,
      flag: this.adjustHeadingGeneration,
    });
  }
}
