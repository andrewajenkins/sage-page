import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommandService } from '../../../common/services/command.service';
import { ComponentLogger } from '../../../common/logger/loggers';
import {
  ContentAction,
  EditorAction,
  isContentCommand,
  isFileCommand,
  isSectionCommand,
  isSectionsCommand,
  isValueCommand,
  NodeAction,
} from '../../../common/models/command.model';
import { ContentSection, isSection } from '../../../common/models/section.model';
import { NodeService } from '../../../common/services/node.service';
import { FileTreeFile, isContentNode, isFile } from '../../../common/models/file-tree.model';
import { recursiveDeleteNode } from '../../../common/utils/tree-utils';
import { remove } from 'lodash';
import { NodeFactory } from '../../../common/utils/node.factory';

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
    this.selectionsSubscription = this.commandService.action$.subscribe((cmd) => {
      if (isSectionsCommand(cmd) && cmd.action === ContentAction.ADD_SECTIONS) {
        if (this.nodeService.hasCurrent() && isContentNode(this.nodeService.currentNode)) {
          this.nodeService.currentNode.sections.push(...cmd.sections);
        }
        this.scrollDown();
      } else if (cmd.action === EditorAction.SAVE_CONTENT) {
        if (!this.nodeService.currentNode) return;
        if (isFile(this.nodeService.currentNode) || isSection(this.nodeService.currentNode)) {
          this.nodeService.currentNode.sections = this.section?.sections || [];
          this.nodeService.currentNode.content = this.section?.content || [];
          this.commandService.perform({
            action: NodeAction.GENERATE_FILE_SECTIONS,
          });
        }
      } else if (isFileCommand(cmd) && cmd.action === NodeAction.LOAD_FILE) {
        this.nodeService.currentFile.sections = cmd.file?.sections || [];
        this.section = cmd.file;
      } else if (isSectionCommand(cmd) && cmd.action === NodeAction.LOAD_SECTION) {
        this.section = cmd.section;
      } else if (isContentCommand(cmd) && cmd.action === NodeAction.DELETE_NODE) {
        if (cmd.content.id) {
          recursiveDeleteNode(this.section as ContentSection, cmd.content.id);
        }
        if (isSection(this.section) || isFile(this.section)) {
          remove(this.section.sections, (section) => section.text === cmd.content.text);
          remove(this.section.content, (content) => content.text === cmd.content.text);
        }
      } else if (cmd.action === NodeAction.DELETE_CURRENT_NODE) {
        this.section = undefined;
      } else if (isValueCommand(cmd) && isSectionCommand(cmd) && cmd.action === EditorAction.CREATE_SECTION) {
        if (!this.section) return;
        let index = this.section.sections.findIndex((section) => section.id === cmd.section.id);
        console.log('sections index:', index);
        const array = index >= 0 ? this.section.sections : this.section.content;
        if (index < 0) {
          index = this.section.content.findIndex((section) => section.id === cmd.section.id);
          console.log('content index:', index);
        }
        const newSection = NodeFactory.createSection({
          editable: true,
          parent_id: this.section.id as number,
          parent_type: 'section',
        });
        if (cmd.value == 'above') {
          console.log('above:', array.length, index);
          array.splice(index, 0, newSection);
        } else {
          console.log('below:', array.length, index);
          array.splice(index + 1, 0, newSection);
        }
        newSection.focused = true;
      }
    });
  }
  scrollDown() {
    this.cdRef.detectChanges();
    try {
      this.wikiWindow.nativeElement.scrollTop = this.wikiWindow.nativeElement.scrollHeight;
    } catch (e) {}
  }

  ngOnDestroy() {
    this.selectionsSubscription.unsubscribe();
  }
}
