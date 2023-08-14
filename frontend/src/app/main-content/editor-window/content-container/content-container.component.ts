import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../../../common/services/data.service';
import { CommandService } from '../../../common/services/command.service';
import { ComponentLogger } from '../../../common/logger/loggers';
import {
  ContentAction,
  isFileCommand,
  isSectionsCommand,
  NodeAction,
} from '../../../common/models/command.model';
import { ContentSection } from '../../../common/models/section.model';
import { NodeService } from '../../../common/services/node.service';

@Component({
  selector: 'app-content-container',
  templateUrl: './content-container.component.html',
  styleUrls: ['./content-container.component.scss'],
})
@ComponentLogger()
export class ContentContainerComponent {
  @ViewChild('scrollMe') private wikiWindow!: ElementRef;
  sections: ContentSection[] = [];
  private selectionsSubscription: Subscription;

  constructor(
    private commandService: CommandService,
    private dataService: DataService,
    private nodeService: NodeService,
    private cdRef: ChangeDetectorRef
  ) {
    this.selectionsSubscription = this.commandService.action$.subscribe(
      (cmd) => {
        if (
          isSectionsCommand(cmd) &&
          cmd.action === ContentAction.ADD_SECTIONS
        ) {
          const content = cmd.sections as ContentSection[];
          this.nodeService.currentFile?.sections.push(...content);
          this.sections = cmd.sections || [];
          this.scrollDown();
        }
      }
    );
    this.commandService.action$.subscribe((cmd) => {
      if (cmd.action === NodeAction.SAVE_FILE) {
        // this.dataService.updateNode(this.file).subscribe();
        this.commandService.perform({
          action: NodeAction.GENERATE_FILE_SECTIONS,
        });
      }
    });
    this.commandService.action$.subscribe((cmd) => {
      if (isFileCommand(cmd) && cmd.action === NodeAction.LOAD_FILE) {
        this.nodeService.currentFile.sections = cmd.file?.sections || [];
        this.sections = cmd.file?.sections || [];
      }
    });
  }
  scrollDown() {
    this.cdRef.detectChanges();
    try {
      this.wikiWindow.nativeElement.scrollTop =
        this.wikiWindow.nativeElement.scrollHeight;
    } catch (e) {}
  }

  buttonClicked(entry: ContentSection) {
    // entry.selected = !entry.selected;
  }

  ngOnDestroy() {
    this.selectionsSubscription.unsubscribe();
  }
}
