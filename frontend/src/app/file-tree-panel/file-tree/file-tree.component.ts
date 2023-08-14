import { Component } from '@angular/core';
import { CommandService } from '../../common/services/command.service';
import { DataService } from '../../common/services/data.service';
import { ComponentLogger } from '../../common/logger/loggers';
import {
  FileTreeFolder,
  FileTreeNode,
  isFile,
  isFolder,
} from '../../common/models/file-tree.model';
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

  treeControl = new NestedTreeControl<FileTreeNode>((node) => {
    if (isFolder(node)) {
      return node.subNodes;
    } else if (isSection(node) || isFile(node)) {
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
    this.nodeService.init();
  }
  ngOnInit() {
    this.dataService.getFileTree().subscribe((fileTree) => {
      this.matTreeService.refreshTree(fileTree);
      this.treeControl.dataNodes = this.dataSource.data;
    });
  }
  nodeHighlight(event: MouseEvent, newNode: FileTreeNode) {
    const previousNode = this.highlightNode;
    const currentNode = this.nodeService.currentNode;

    if (newNode.id === previousNode?.id) return;

    if (
      this.highlightElement &&
      previousNode &&
      previousNode.id !== currentNode?.id
    )
      this.highlightElement.style.backgroundColor = 'white';

    this.highlightElement = event.target as HTMLElement;
    this.highlightNode = newNode;

    if (this.highlightElement && newNode.id !== currentNode?.id)
      this.highlightElement.style.backgroundColor = 'whitesmoke';
  }

  nodeSelect(event: MouseEvent, node: FileTreeNode) {
    // update styles and statuses for selected node
    this.nodeService.currentNode = node;
    if (this.currentElement)
      this.currentElement.style.backgroundColor = 'white';
    this.currentElement = event.target as HTMLElement;
    this.currentElement.style.backgroundColor =
      'var(--mat-standard-button-toggle-selected-state-background-color)';

    if (isFile(node)) {
      this.commandService.perform({
        action: NodeAction.LOAD_FILE,
        node: node,
      });
      this.commandService.perform({
        action: StateAction.SET_FILE_SELECTED,
        flag: true,
      });
    }
  }

  nodeUnHighlight($event: MouseEvent, previousNode: FileTreeNode) {
    if (
      this.highlightElement &&
      previousNode &&
      previousNode.id !== this.nodeService.currentNode?.id
    )
      this.highlightElement.style.backgroundColor = 'white';
    this.highlightNode = undefined;
    this.highlightElement = undefined;
  }

  getClass(node: FileTreeNode) {
    if (!node.id) console.log('get', node);
    if (!this.nodeService?.currentNode?.id)
      console.log('cur:', this.nodeService?.currentNode);
    return this.currentElement && node.id === this.nodeService.currentNode.id;
  }
  hasSub = (_: number, node: FileTreeFolder) =>
    isFolder(node) || isFile(node) || isSection(node);
}
