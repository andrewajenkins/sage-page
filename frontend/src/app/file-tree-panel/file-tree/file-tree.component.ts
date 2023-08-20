import { Component } from '@angular/core';
import { CommandService } from '../../common/services/command.service';
import { DataService } from '../../common/services/data.service';
import { ComponentLogger } from '../../common/logger/loggers';
import { FileTreeFolder, FileTreeNode, isFile, isFolder } from '../../common/models/file-tree.model';
import { NodeAction, StateAction } from '../../common/models/command.model';
import { NodeService } from '../../common/services/node.service';
import { MatTreeService } from '../../common/services/mat-tree.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { isSection } from '../../common/models/section.model';
import { FileTreeActionHandler } from './file-tree-action-handler';

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

  treeControl = new NestedTreeControl<FileTreeNode>((node) => {
    if (isFolder(node)) {
      return node.subNodes;
    } else if (node.type == 'heading' || isSection(node) || isFile(node)) {
      return node.sections;
    }
    return [];
  });
  dataSource = new MatTreeNestedDataSource<FileTreeNode>();

  // TODO temp remove
  constructor(
    private commandService: CommandService,
    private nodeService: NodeService,
    private matTreeService: MatTreeService,
    private dataService: DataService,
    private fileHandler: FileTreeActionHandler // keep, needs init
  ) {
    this.matTreeService.registerComponent(this);
    this.fileHandler.init();
    this.curr = this.nodeService.currentNode;
  }
  ngOnInit() {
    this.nodeService.init();
    this.dataService.getFileTree().subscribe((fileTree) => {
      this.matTreeService.refreshTree(fileTree);
      this.treeControl.dataNodes = this.dataSource.data;
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

  nodeSelect(event: MouseEvent, node: FileTreeNode) {
    // update styles and statuses for selected node
    this.nodeService.currentNode = node;
    this.curr = node;
    if (this.currentElement) this.currentElement.style.backgroundColor = 'white';
    this.currentElement = event.target as HTMLElement;
    this.currentElement.style.backgroundColor = 'var(--mat-standard-button-toggle-selected-state-background-color)';

    if (isSection(node)) {
      this.commandService.perform({
        action: NodeAction.LOAD_SECTION,
        section: node,
      });
    }
    if (isFile(node)) {
      this.commandService.perform({
        action: NodeAction.LOAD_FILE,
        file: node,
      });
    }
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
  hasSub = (_: number, node: FileTreeFolder) =>
    node?.type == 'heading' || isFolder(node) || isFile(node) || isSection(node);

  getIcon(node) {
    if (node.type == 'folder') return 'folder';
    else if (node.type == 'file') return 'description';
    else return 'format_h' + (7 - node.textType);
    // return node.type == 'folder' ? 'folder' : 'description';
  }

  getSectionSymbol(node) {
    if (node.sections?.length == 0) return '';
    return this.treeControl.isExpanded(node) ? 'chevron_right' : 'expand_more';
  }
}
