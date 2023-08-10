import { ChangeDetectorRef, Component } from '@angular/core';
import { SettingsService } from '../settings-popover/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
})
export class MainContentComponent {
  private settingsSubscription: Subscription;
  botOrderIndex: number = 1;
  wikiOrderIndex: number = 2;
  constructor(private settingsService: SettingsService) {
    this.settingsSubscription = this.settingsService.settings$.subscribe(
      (newSettings) => {
        console.log('main-content: new-settings:', newSettings);
        if (newSettings.wikiRight) {
          this.botOrderIndex = 1;
          this.wikiOrderIndex = 2;
        } else {
          this.botOrderIndex = 2;
          this.wikiOrderIndex = 1;
        }
      },
    );
  }
  ngOnDestroy() {
    this.settingsSubscription.unsubscribe();
  }
}
