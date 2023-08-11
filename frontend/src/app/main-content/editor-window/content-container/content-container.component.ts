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
import { FileTreeFile } from '../../../file-tree-panel/file-tree/file-tree.component';
import { DataService } from '../../../common/services/data.service';
import {
  CommandService,
  Action,
} from '../../../common/services/command.service';
import { ComponentLogger } from '../../../common/logger/loggers';
import {
  ContentAction,
  ContentBridgeService,
} from '../../../common/services/content-bridge.service';
import { UiStateManager } from '../../../common/services/ui-state-manager.service';

@Component({
  selector: 'app-content-container',
  templateUrl: './content-container.component.html',
  styleUrls: ['./content-container.component.scss'],
})
@ComponentLogger()
export class ContentContainerComponent {
  @ViewChild('scrollMe') private wikiWindow!: ElementRef;

  private selectionsSubscription: Subscription;
  contentSections!: ContentSection[];
  file!: FileTreeFile;
  position = 0;
  positionHighlighter: ContentSection = {
    botID: -1,
    type: ContentSectionType.HIGHLIGHT,
    text: 'never show',
    selected: false,
  };
  private positionLocked!: Boolean;
  private fileTreeSubscription: Subscription;

  constructor(
    private commandService: CommandService,
    private contentBridgeService: ContentBridgeService,
    private uiStateManager: UiStateManager,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef
  ) {
    // this.contentSections = [];
    // this.contentSections.push(this.positionHighlighter);
    this.selectionsSubscription = this.contentBridgeService.content$.subscribe(
      (state) => {
        if (state.action === ContentAction.ADD_SECTIONS) {
          const content = state.content as ContentSection[];
          this.file?.content.push(...content);
          // this.contentSections.splice(this.position, 0, ...content);
          this.position = this.position + content.length;
          this.scrollDown();
        }
      }
    );
    this.fileTreeSubscription = this.commandService.action$.subscribe((cmd) => {
      if (cmd.action === Action.LOAD_FILE) {
        this.dataService.getFile(cmd.id as number).subscribe((file) => {
          this.file = file;
          // this.contentSections = file.content;
          // this.position = file.content.length;
          // // add highlighter if there is none
          // const result = this.contentSections.findIndex(
          //   (content: ContentSection) =>
          //     content.type === ContentSectionType.HIGHLIGHT
          // );
          // if (result >= 0) {
          //   this.position = result;
          // } else {
          //   this.contentSections.push(this.positionHighlighter);
          // }
          this.scrollDown();
        });
      }
    });
    this.commandService.action$.subscribe((data) => {
      if (data.action === Action.SAVE_FILE) {
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

  setPosition(button: ContentSection) {
    if (button.type === ContentSectionType.HIGHLIGHT || this.positionLocked) {
      return;
    }
    //remove previous
    this.contentSections.splice(this.position, 1);
    //set new
    this.position = this.contentSections.findIndex(
      (content) => content.uid === button.uid
    );
    this.position++; // add highlight button after
    this.contentSections.splice(this.position, 0, this.positionHighlighter);
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
    entry.selected = !entry.selected;
    if (entry.type === ContentSectionType.HIGHLIGHT) {
      entry.locked = !entry.locked;
      this.positionLocked = entry.locked;
    }
  }

  ngOnDestroy() {
    this.selectionsSubscription.unsubscribe();
    this.fileTreeSubscription.unsubscribe();
  }
}
