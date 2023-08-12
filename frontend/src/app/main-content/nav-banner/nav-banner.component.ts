import { Component } from '@angular/core';
import { CommandService } from '../../common/services/command.service';
import { filter, Subscription } from 'rxjs';
import { DataService } from '../../common/services/data.service';
import { NodeAction, Command } from '../../common/models/command.model';

@Component({
  selector: 'app-nav-banner',
  templateUrl: './nav-banner.component.html',
  styleUrls: ['./nav-banner.component.scss'],
})
export class NavBannerComponent {
  private fileTreeSubscription!: Subscription;
  wikiTitle = 'Untitled';
  task = 'Create Angular 10 table of contents';
  constructor(
    private commandService: CommandService,
    private dataService: DataService
  ) {}
  ngOnInit() {
    this.commandService.action$
      .pipe(
        filter(
          (cmd: Command<NodeAction>) =>
            cmd.action === NodeAction.CREATE_SUBSECTION
        )
      )
      .subscribe((cmd: Command<NodeAction>) => {
        this.task = 'Create "' + cmd.content?.text + '" section outline';
      });
    this.fileTreeSubscription = this.commandService.action$.subscribe((cmd) => {
      if (cmd.action === NodeAction.LOAD_FILE)
        this.dataService.getFile(cmd.id as number).subscribe((file) => {
          // TODO resolve this redundant request
          this.wikiTitle = file.name;
        });
    });
  }

  ngOnDestroy() {
    this.fileTreeSubscription.unsubscribe();
  }
}
