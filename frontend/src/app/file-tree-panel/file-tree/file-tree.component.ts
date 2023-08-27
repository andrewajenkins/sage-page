import { Component } from '@angular/core';
import { CommandService } from '../../common/services/command.service';
import { DataService } from '../../common/services/data.service';
import { ComponentLogger } from '../../common/logger/loggers';
import { isNodeCommand, NodeAction, StateAction } from '../../common/models/command.model';
import { TreeService } from '../../common/services/tree.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ContentNode } from '../../common/models/content-node.model';
import { FileTreeActionHandler } from './file-tree-action-handler';
import { NotificationService } from '../../common/services/notification.service';

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
})
@ComponentLogger()
export class FileTreeComponent {
  // element node references
  highlightElement!: HTMLElement | undefined;
  highlightNode!: ContentNode | undefined;
  currentElement!: HTMLElement;
  curr!: ContentNode | undefined;
  dataSource!: MatTreeNestedDataSource<ContentNode>;
  treeControl!: NestedTreeControl<ContentNode>;

  // TODO temp remove
  constructor(
    private commandService: CommandService,
    private treeService: TreeService,
    private fileHandler: FileTreeActionHandler, // keep, needs init
    private notificationService: NotificationService // keep, needs init
  ) {
    this.fileHandler.init();
    this.notificationService.init();
    this.curr = this.treeService.currentNode;
    this.commandService.action$.subscribe((cmd) => {
      const currentNode = this.treeService.currentNode;
      if (currentNode) {
        if (cmd.action === StateAction.COLLAPSE_FILE_TREE_ALL) {
          this.treeService.collapseAll();
        } else if (cmd.action === StateAction.EXPAND_FILE_TREE_ALL) {
          this.treeService.expandAll();
        } else if (isNodeCommand(cmd) && cmd.action === NodeAction.LOAD_NODE) {
          this.nodeSelectHighlight(cmd.node);
        }
      }
    });
  }
  ngOnInit() {
    this.dataSource = this.treeService.tree.dataSource;
    this.treeControl = this.treeService.tree.treeControl;
  }
  nodeHighlight(event: MouseEvent, newNode: ContentNode) {
    const previousNode = this.highlightNode;
    const currentNode = this.treeService.currentNode;

    if (newNode.id === previousNode?.id) return;

    if (this.highlightElement && previousNode && previousNode.id !== currentNode?.id)
      this.highlightElement.style.backgroundColor = 'white';

    this.highlightElement = event.target as HTMLElement;
    this.highlightNode = newNode;

    if (this.highlightElement && newNode.id !== currentNode?.id)
      this.highlightElement.style.backgroundColor = 'whitesmoke';
  }
  nodeSelect(node: ContentNode) {
    this.nodeSelectHighlight(node);
    this.curr = node;
    this.commandService.perform({
      action: NodeAction.LOAD_NODE,
      node: node,
    });
  }
  nodeSelectHighlight(node: ContentNode) {
    if (this.treeService.previousNode) this.treeService.previousNode.selected = false;
    if (this.treeService.currentNode) this.treeService.previousNode = this.treeService.currentNode;
    this.treeService.currentNode = node;
    node.selected = true;
  }

  nodeUnHighlight($event: MouseEvent, previousNode: ContentNode) {
    if (this.highlightElement && previousNode && previousNode.id !== this.treeService.currentNode?.id)
      this.highlightElement.style.backgroundColor = 'white';
    this.highlightNode = undefined;
    this.highlightElement = undefined;
  }

  getClass(node: ContentNode) {
    return this.currentElement && node.id === this.treeService.currentNode?.id;
  }
  hasSub = (_: number, node: ContentNode) => {
    if (node.isFolder()) return node.subNodes.filter((subNode) => this.isValid(subNode)).length > 0;
    else {
      return node.sections.filter((subNode) => this.isValid(subNode)).length > 0;
    }
  };
  // node?.type == 'heading' || isFolder(node) || isFile(node) || isSection(node);

  getIcon(node) {
    if (node.type == 'folder') return 'folder';
    else if (node.type == 'file') return 'description';
    else return 'format_h' + node.depth;
    // return node.type == 'folder' ? 'folder' : 'description';
  }

  getSectionSymbol(node) {
    if (node.subNodes?.length > 0 || node.sections?.length > 0)
      return this.treeService.treeState.isExpanded(node) ? 'chevron_right' : 'expand_more';
    else return '';
  }

  isValid(node: ContentNode) {
    return node.isFolder || node.isFile() || node.generated;
  }
}
