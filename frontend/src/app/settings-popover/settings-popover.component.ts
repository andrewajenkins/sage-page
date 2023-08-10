import { Component } from '@angular/core';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings-popover',
  templateUrl: './settings-popover.component.html',
  styleUrls: ['./settings-popover.component.scss'],
})
export class SettingsPopoverComponent {
  isWikiRight!: boolean;

  constructor(private settingsService: SettingsService) {
    this.toggleWikiRight();
  }

  toggleWikiRight() {
    this.isWikiRight = !this.isWikiRight;
    this.settingsService.updateSettings({
      wikiRight: this.isWikiRight,
    });
  }
}
