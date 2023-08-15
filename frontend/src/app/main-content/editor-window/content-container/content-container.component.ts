import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CommandService } from '../../../common/services/command.service';
import { ComponentLogger } from '../../../common/logger/loggers';
import {
  ContentAction,
  isFileCommand,
  isSectionCommand,
  isSectionsCommand,
  NodeAction,
} from '../../../common/models/command.model';
import { ContentSection } from '../../../common/models/section.model';
import { NodeService } from '../../../common/services/node.service';
import {
  FileTreeFile,
  isContentNode,
} from '../../../common/models/file-tree.model';

@Component({
  selector: 'app-content-container',
  templateUrl: './content-container.component.html',
  styleUrls: ['./content-container.component.scss'],
})
@ComponentLogger()
export class ContentContainerComponent {
  @ViewChild('scrollMe') private wikiWindow!: ElementRef;
  section!: ContentSection | FileTreeFile | undefined;
  private selectionsSubscription: Subscription;

  constructor(
    private commandService: CommandService,
    private nodeService: NodeService,
    private cdRef: ChangeDetectorRef
  ) {
    this.selectionsSubscription = this.commandService.action$.subscribe(
      (cmd) => {
        if (
          isSectionsCommand(cmd) &&
          cmd.action === ContentAction.ADD_SECTIONS
        ) {
          if (
            this.nodeService.hasCurrent() &&
            isContentNode(this.nodeService.currentNode)
          ) {
            this.nodeService.currentNode.sections.push(...cmd.sections);
          }
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
        this.section = cmd.file;
      } else if (
        isSectionCommand(cmd) &&
        cmd.action === NodeAction.LOAD_SECTION
      ) {
        this.section = cmd.section;
      }
    });
    this.commandService.action$.subscribe((cmd) => {
      if (cmd.action === NodeAction.DELETE_NODE) {
        this.section = undefined;
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

  ngOnDestroy() {
    this.selectionsSubscription.unsubscribe();
  }
}
