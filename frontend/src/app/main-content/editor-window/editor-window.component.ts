import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { FileTreeNode } from '../../file-tree-panel/file-tree/file-tree.component';
import { Action, CommandService } from '../../common/services/command.service';
import { DataService } from '../../common/services/data.service';

@Component({
  selector: 'app-editor-window',
  templateUrl: './editor-window.component.html',
  styleUrls: ['./editor-window.component.scss'],
})
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
    });
  }
  ngOnDestroy() {
    this.fileTreeSubscription.unsubscribe();
  }
}
