import { Component } from '@angular/core';
import { CommandService } from '../../common/services/command.service';
import { DataService } from '../../common/services/data.service';
import { ComponentLogger } from '../../common/logger/loggers';
import { FileTreeNode, isFile, isFolder } from '../../common/models/file-tree.model';
import { isNodeCommand, NodeAction, StateAction } from '../../common/models/command.model';
import { NodeService } from '../../common/services/node.service';
import { MatTreeService } from '../../common/services/mat-tree.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ContentSection, isSection } from '../../common/models/section.model';
import { FileTreeActionHandler } from './file-tree-action-handler';
import { NotificationService } from '../../common/services/notification.service';
import { assembleTree } from '../../common/utils/tree-utils';

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
})
@ComponentLogger()
export class FileTreeComponent {
  // element node references
  highlightElement!: HTMLElement | undefined;
  highlightNode!: FileTreeNode | undefined;
  currentElement!: HTMLElement;
  curr!: FileTreeNode | undefined;

  dataSource = new MatTreeNestedDataSource<FileTreeNode>();
  treeControl = new NestedTreeControl<FileTreeNode>((node) => {
    if (isFolder(node)) {
      return node.subNodes;
    } else if (node.type == 'heading' || isSection(node) || isFile(node)) {
      return node.sections;
    }
    return [];
  });

  // TODO temp remove
  constructor(
    private commandService: CommandService,
    private nodeService: NodeService,
    private matTreeService: MatTreeService,
    private dataService: DataService,
    private fileHandler: FileTreeActionHandler, // keep, needs init
    private notificationService: NotificationService // keep, needs init
  ) {
    this.matTreeService.registerComponent(this);
    this.fileHandler.init();
    this.notificationService.init();
    this.curr = this.nodeService.currentNode;
    this.commandService.action$.subscribe((cmd) => {
      if (this.nodeService.currentNode) {
        if (cmd.action === StateAction.COLLAPSE_FILE_TREE_ALL) {
          this.treeControl.dataNodes = this.dataSource.data;
          this.treeControl.getDescendants(this.nodeService.currentNode).forEach((node) => {
            this.treeControl.expand(node);
          });
          this.treeControl.expand(this.nodeService.currentNode);
        } else if (cmd.action === StateAction.EXPAND_FILE_TREE_ALL) {
          this.treeControl.dataNodes = this.dataSource.data;
          this.treeControl.getDescendants(this.nodeService.currentNode).forEach((node) => {
            this.treeControl.collapse(node);
          });
          this.treeControl.collapse(this.nodeService.currentNode);
        } else if (isNodeCommand(cmd) && cmd.action === NodeAction.LOAD_NODE) {
          this.nodeSelectHighlight(cmd.node);
        }
      }
    });
  }
  ngOnInit() {
    this.dataService.getFileTree().subscribe((fileTree) => {
      this.nodeService.nodeMap = assembleTree(fileTree, this.nodeService.currentNode as ContentSection);
      this.matTreeService.refreshTree(fileTree);
      this.treeControl.expandAll();
      this.treeControl.dataNodes.forEach((node) => {
        this.treeControl.collapse(node);
      });
    });
  }
  nodeHighlight(event: MouseEvent, newNode: FileTreeNode) {
    const previousNode = this.highlightNode;
    const currentNode = this.nodeService.hasCurrent() ? this.nodeService.currentNode : undefined;

    if (newNode.id === previousNode?.id) return;

    if (this.highlightElement && previousNode && previousNode.id !== currentNode?.id)
      this.highlightElement.style.backgroundColor = 'white';

    this.highlightElement = event.target as HTMLElement;
    this.highlightNode = newNode;

    if (this.highlightElement && newNode.id !== currentNode?.id)
      this.highlightElement.style.backgroundColor = 'whitesmoke';
  }
  nodeSelect(node: FileTreeNode) {
    this.nodeSelectHighlight(node);
    this.curr = node;
    this.commandService.perform({
      action: NodeAction.LOAD_NODE,
      node: node,
    });
  }
  nodeSelectHighlight(node: FileTreeNode) {
    if (this.nodeService.prev) this.nodeService.prev.selected = false;
    if (this.nodeService.currentNode) this.nodeService.prev = this.nodeService.currentNode;
    this.nodeService.currentNode = node;
    node.selected = true;
  }

  nodeUnHighlight($event: MouseEvent, previousNode: FileTreeNode) {
    if (this.highlightElement && previousNode && previousNode.id !== this.nodeService.currentNode?.id)
      this.highlightElement.style.backgroundColor = 'white';
    this.highlightNode = undefined;
    this.highlightElement = undefined;
  }

  getClass(node: FileTreeNode) {
    return this.currentElement && node.id === this.nodeService.currentNode?.id;
  }
  hasSub = (_: number, node: FileTreeNode) =>
    node?.type == 'heading' || isFolder(node) || isFile(node) || isSection(node);

  getIcon(node) {
    if (node.type == 'folder') return 'folder';
    else if (node.type == 'file') return 'description';
    else return 'format_h' + node.depth;
    // return node.type == 'folder' ? 'folder' : 'description';
  }

  getSectionSymbol(node) {
    if (node.sections?.length == 0) return '';
    return this.treeControl.isExpanded(node) ? 'chevron_right' : 'expand_more';
  }
}
