import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { FileTreeNode } from '../../file-tree-panel/file-tree/file-tree.component';
import { Action, CommandService } from '../../common/services/command.service';
import { DataService } from '../../common/services/data.service';
import { ComponentLogger } from '../../common/logger/loggers';

@Component({
  selector: 'app-editor-window',
  templateUrl: './editor-window.component.html',
  styleUrls: ['./editor-window.component.scss'],
})
@ComponentLogger()
export class EditorWindowComponent {
  private fileTreeSubscription: Subscription;
  wikiTitle = 'Untitled';
  constructor(
    private commandService: CommandService,
    private dataService: DataService
  ) {
    this.fileTreeSubscription = this.commandService.action$.subscribe((cmd) => {
      if (cmd.action === Action.LOAD_FILE)
        this.dataService.getFile(cmd.id as number).subscribe((file) => {
          // TODO resolve this redundant request
          this.wikiTitle = file.name;
        });
      if (cmd.action === Action.SAVE_FILE) {
        // this.dataService.setNode(cmd.id as number).subscribe();
      }
    });
  }
  ngOnDestroy() {
    this.fileTreeSubscription.unsubscribe();
  }
}
