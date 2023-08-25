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
import { ContentSection, isSection } from '../../../common/models/section.model';
import { NodeService } from '../../../common/services/node.service';
import { FileTreeFile, isContentNode, isFile, isFolder } from '../../../common/models/file-tree.model';
import { assembleTree, buildMapV2, parseNodes, recursiveDeleteNode } from '../../../common/utils/tree-utils';
import { remove } from 'lodash';
import { NodeFactory } from '../../../common/utils/node.factory';
import { Clipboard } from '@angular/cdk/clipboard';
import { DataService } from '../../../common/services/data.service';
import { MatTreeService } from '../../../common/services/mat-tree.service';

@Component({
  selector: 'app-content-container',
  templateUrl: './content-container.component.html',
  styleUrls: ['./content-container.component.scss'],
})
@ComponentLogger()
export class ContentContainerComponent {
  @ViewChild('scrollMe') private wikiWindow!: ElementRef;
  section!: ContentSection | FileTreeFile | undefined;
  private selectionsSubscription!: Subscription;

  constructor(
    private commandService: CommandService,
    private nodeService: NodeService,
    private clipboard: Clipboard,
    private dataService: DataService,
    private matTreeService: MatTreeService,
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
      if (isSectionsCommand(cmd) && cmd.action === ContentAction.ADD_SECTIONS) {
        if (this.nodeService.hasCurrent() && isContentNode(this.nodeService.currentNode)) {
          this.nodeService.currentNode.sections.push(...cmd.sections);
        }
        this.scrollDown();
      } else if (cmd.action === EditorAction.SAVE_CONTENT) {
        if (!this.nodeService.currentNode) return;
        const currentNode = this.nodeService.currentNode;
        if (!this.hasNewSections(currentNode)) {
          this.commandService.perform({
            action: StateAction.NOTIFY,
            value: 'Nothing to save',
          });
          return;
        }
        if (isFile(currentNode) || isSection(currentNode)) {
          const parseResult = parseNodes(currentNode as ContentSection);
          const sectionNodes = buildMapV2(parseResult as ContentSection);
          currentNode.sections = sectionNodes;
          console.log('currentNode:', currentNode);
          this.dataService.createSections(currentNode as ContentSection).subscribe((fileTree: any) => {
            const { nodeMap, rootNodes } = assembleTree(fileTree, this.nodeService.currentNode as ContentSection);
            this.nodeService.nodeMap = nodeMap;
            for (let node of nodeMap.values()) this.dataService.updateNode(node).subscribe((node) => {});
            this.matTreeService.refreshTree(rootNodes as ContentSection[]);
          });
        } else
          this.commandService.perform({
            action: StateAction.NOTIFY,
            value: 'Failed to generate sections, current node is not a file or section',
          });
      } else if (isNodeCommand(cmd) && cmd.action === NodeAction.LOAD_NODE) {
        if (isFolder(cmd.node)) this.section = undefined;
        if (isFile(cmd.node) || isSection(cmd.node)) this.section = cmd.node;
      } else if (isContentCommand(cmd) && cmd.action === NodeAction.DELETE_NODE) {
        if (cmd.content.id) {
          recursiveDeleteNode(this.section as ContentSection, cmd.content.id);
        }
        if (isSection(this.section) || isFile(this.section)) {
          remove(this.section.sections, (section) => section.text === cmd.content.text);
          remove(this.section.contents, (content) => content.text === cmd.content.text);
        }
      } else if (cmd.action === NodeAction.DELETE_CURRENT_NODE) {
        this.section = undefined;
      } else if (isValueCommand(cmd) && isSectionCommand(cmd) && cmd.action === EditorAction.CREATE_SECTION) {
        if (!this.section) notifyPickSection();
        const section = this.section!;
        let index = section.sections.findIndex((section) => section.id === cmd.section.id);
        console.log('sections index:', index);
        const array = index >= 0 ? section.sections : section.contents;
        if (index < 0) {
          index = section.contents.findIndex((section) => section.id === cmd.section.id);
          console.log('content index:', index);
        }
        const newSection = NodeFactory.createSection({
          editable: true,
          parent_id: section.id as number,
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
        const deleteSelected = (content: ContentSection[]) => {
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

        if (this.nodeService.acceptsContent()) {
          this.section!.contents.unshift(
            NodeFactory.createSection({ parent_id: this.section!.id as number, editable: true })
          );
        } else throw new Error("Can't add section - no node selected in file tree!");
      } else if (cmd.action === EditorAction.UPLOAD) {
        if (!this.section) notifyPickSection();
        navigator.clipboard.readText().then((text) => {
          console.log('tset:', NodeFactory.createSectionsFromText(text, this.section!.id as number));
          this.commandService.perform({
            action: ContentAction.ADD_SECTIONS,
            sections: NodeFactory.createSectionsFromText(text, this.section!.id as number),
          });
        });
      }
    });
  }

  hasNewSections(node) {
    return !!node.sections?.some((section) => !section.generated);
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
