import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommandService } from '../common/services/command.service';
import { isFlagCommand, StateAction } from '../common/models/command.model';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
})
export class MainContentComponent {
  private settingsSubscription: Subscription;
  botOrderIndex: number = 1;
  wikiOrderIndex: number = 2;
  constructor(
    private commandService: CommandService,
    private cdRef: ChangeDetectorRef
  ) {
    this.settingsSubscription = this.commandService.action$.subscribe((cmd) => {
      if (isFlagCommand(cmd) && cmd.action === StateAction.SET_EDITOR_LEFT) {
        if (cmd.flag) {
          this.wikiOrderIndex = 1;
          this.botOrderIndex = 2;
        } else {
          this.botOrderIndex = 1;
          this.wikiOrderIndex = 2;
        }
      }
    });
  }
  ngOnDestroy() {
    this.settingsSubscription.unsubscribe();
  }
}
