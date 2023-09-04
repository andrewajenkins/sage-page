import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommandService } from '../../../common/services/command.service';
import { ComponentLogger } from '../../../common/logger/loggers';
import {
  ContentAction,
  EditorAction,
  isContentCommand,
  isNodeCommand,
  isSectionCommand,
  isSectionsCommand,
  isValueCommand,
  NodeAction,
  StateAction,
} from '../../../common/models/command.model';
import { ContentNode } from '../../../common/models/content-node.model';
import { recursiveDeleteNode } from '../../../common/utils/tree-utils';
import { remove } from 'lodash';
import { Clipboard } from '@angular/cdk/clipboard';
import { TreeService } from '../../../common/services/tree.service';
import { NodeFactory } from '../../../common/utils/node.factory';

@Component({
  selector: 'app-content-container',
  templateUrl: './content-container.component.html',
  styleUrls: ['./content-container.component.scss'],
})
@ComponentLogger()
export class ContentContainerComponent {
  @ViewChild('scrollMe') private wikiWindow!: ElementRef;
  section!: ContentNode | ContentNode | undefined;
  private selectionsSubscription!: Subscription;

  constructor(
    private commandService: CommandService,
    private clipboard: Clipboard,
    private treeService: TreeService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.selectionsSubscription = this.commandService.action$.subscribe((cmd) => {
      const notifyPickSection = () => {
        if (!this.section) {
          this.commandService.perform({
            action: StateAction.NOTIFY,
            value: 'Please pick a section to edit from the file tree!',
          });
          let section = this.section!;
          throw new Error('No section selected');
        }
      };
      const currentNode = this.treeService.currentNode;
      if (isSectionsCommand(cmd) && cmd.action === ContentAction.ADD_SECTIONS) {
        if (currentNode) {
          currentNode.sections.push(...cmd.sections);
        }
        this.scrollDown();
      } else if (cmd.action === EditorAction.SAVE_CONTENT) {
        this.treeService.updateNodes();
      } else if (isNodeCommand(cmd) && cmd.action === NodeAction.LOAD_NODE) {
        if (cmd.node.isFolder()) this.section = undefined;
        if (cmd.node.isContentNode()) this.section = cmd.node;
      } else if (isContentCommand(cmd) && cmd.action === NodeAction.DELETE_NODE) {
        if (cmd.content.id) {
          recursiveDeleteNode(this.section as ContentNode, cmd.content.id);
        }
        if (this.section?.isContentNode()) {
          remove(this.section.sections, (section) => section.text === cmd.content.text);
          remove(this.section.contents, (content) => content.text === cmd.content.text);
        }
      } else if (cmd.action === NodeAction.DELETE_CURRENT_NODE) {
        this.section = undefined;
      } else if (isValueCommand(cmd) && isSectionCommand(cmd) && cmd.action === EditorAction.CREATE_SECTION) {
        if (!this.section) notifyPickSection();
        const section = this.section!;
        let index = section.sections.findIndex((section) => section.feId === cmd.section.feId);
        console.log('sections index:', index);
        const array = index >= 0 ? section.sections : section.contents;
        if (index < 0) {
          index = section.contents.findIndex((section) => section.feId === cmd.section.feId);
          console.log('content index:', index);
        }
        const newSection = new ContentNode({
          editable: true,
          parent_id: section.feId,
        });
        if (cmd.value == 'above') {
          console.log('above:', array.length, index);
          array.splice(index, 0, newSection);
        } else {
          console.log('below:', array.length, index);
          array.splice(index + 1, 0, newSection);
        }
        newSection.focused = true;
      } else if (cmd.action === EditorAction.COPY_ALL) {
        if (!this.section) notifyPickSection();
        const content = this.section!.contents.map((content) => content.text).join('  \n');
        const section = this.section!.sections.map((content) => content.text).join('  \n');
        this.clipboard.copy(content + '  \n' + section);
      } else if (cmd.action === EditorAction.COPY_SELECTED) {
        if (!this.section) notifyPickSection();
        const content = this.section!.contents.filter((content) => content.selected)
          .map((content) => content.text)
          .join('  \n');
        const section = this.section!.sections.filter((content) => content.selected)
          .map((content) => content.text)
          .join('  \n');
        this.clipboard.copy(content + '  \n' + section);
      } else if (cmd.action === EditorAction.SELECT_ALL) {
        if (!this.section) notifyPickSection();
        this.section!.contents.forEach((content) => (content.selected = true));
        this.section!.sections.forEach((content) => (content.selected = true));
      } else if (cmd.action === EditorAction.DELETE_SELECTED) {
        const deleteSelected = (content: ContentNode[]) => {
          content
            .filter((content) => content.selected)
            .forEach((content) => {
              if (content.generated)
                this.commandService.perform({
                  action: NodeAction.DELETE_NODE,
                  content: content,
                });
            });
          return content.filter((content) => !content.selected);
        };
        if (!this.section) notifyPickSection();
        this.section!.contents = deleteSelected(this.section!.contents);
        this.section!.sections = deleteSelected(this.section!.sections);
      } else if (cmd.action === EditorAction.DESELECT_ALL) {
        if (!this.section) notifyPickSection();
        this.section!.contents.forEach((content) => (content.selected = false));
        this.section!.sections.forEach((content) => (content.selected = false));
      } else if (cmd.action === EditorAction.ADD_NEW_SECTION) {
        if (!this.section) notifyPickSection();

        if (this.treeService.currentNode?.isContentNode()) {
          this.section!.contents.unshift(new ContentNode({ parent_id: this.section!.feId, editable: true }));
        } else throw new Error("Can't add section - no node selected in file tree!");
      } else if (cmd.action === EditorAction.UPLOAD) {
        if (!this.section) notifyPickSection();
        navigator.clipboard.readText().then((text) => {
          console.log('tset:', NodeFactory.createSectionsFromText(text, this.section!.feId));
          this.commandService.perform({
            action: ContentAction.ADD_SECTIONS,
            sections: NodeFactory.createSectionsFromText(text, this.section!.feId),
          });
        });
      }
    });
  }

  scrollDown() {
    try {
      this.cdRef.detectChanges();
      if (this.wikiWindow?.nativeElement)
        this.wikiWindow.nativeElement.scrollTop = this.wikiWindow?.nativeElement.scrollHeight;
    } catch (e) {}
  }

  ngOnDestroy() {
    this.selectionsSubscription.unsubscribe();
  }
}
