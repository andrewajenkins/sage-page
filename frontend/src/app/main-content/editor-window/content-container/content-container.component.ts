import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ContentSection,
  ContentSectionType,
} from '../../bot-window/bot-window.component';
import { DataService } from '../../../common/services/data.service';
import { CommandService } from '../../../common/services/command.service';
import { ComponentLogger } from '../../../common/logger/loggers';
import { ContentBridgeService } from '../../../common/services/content-bridge.service';
import {
  ContentAction,
  isContentsCommand,
  isIdCommand,
  NodeAction,
} from '../../../common/models/command.model';
import { FileTreeFile } from '../../../common/models/file-tree.model';

@Component({
  selector: 'app-content-container',
  templateUrl: './content-container.component.html',
  styleUrls: ['./content-container.component.scss'],
})
@ComponentLogger()
export class ContentContainerComponent {
  @ViewChild('scrollMe') private wikiWindow!: ElementRef;

  private selectionsSubscription: Subscription;
  file!: FileTreeFile;
  private fileTreeSubscription: Subscription;

  constructor(
    private commandService: CommandService,
    private contentBridgeService: ContentBridgeService,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef
  ) {
    this.selectionsSubscription = this.commandService.action$.subscribe(
      (cmd) => {
        if (
          isContentsCommand(cmd) &&
          cmd.action === ContentAction.ADD_SECTIONS
        ) {
          const content = cmd.contents as ContentSection[];
          this.file?.content.push(...content);
          this.scrollDown();
        }
      }
    );
    this.fileTreeSubscription = this.commandService.action$.subscribe((cmd) => {
      if (isIdCommand(cmd) && cmd.action === NodeAction.LOAD_FILE) {
        this.dataService.getFile(cmd.id as number).subscribe((file) => {
          this.file = file;
          this.scrollDown();
        });
      }
    });
    this.commandService.action$.subscribe((data) => {
      if (data.action === NodeAction.SAVE_FILE) {
        this.dataService.updateNode(this.file).subscribe();
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

  getStyle(type: ContentSectionType) {
    if (type == ContentSectionType.HIGHLIGHT) {
      return {
        'background-color': 'yellow',
        padding: 'unset',
      };
    }
    return {};
  }

  buttonClicked(entry: ContentSection) {
    // entry.selected = !entry.selected;
  }

  ngOnDestroy() {
    this.selectionsSubscription.unsubscribe();
    this.fileTreeSubscription.unsubscribe();
  }
}
