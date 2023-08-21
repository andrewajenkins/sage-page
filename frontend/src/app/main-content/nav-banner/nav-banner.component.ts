import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommandService } from '../../common/services/command.service';
import { Subscription } from 'rxjs';
import { NodeAction, isNodeCommand, isFileCommand, isSectionCommand } from '../../common/models/command.model';
import { NodeService } from '../../common/services/node.service';
import { MatTreeService } from '../../common/services/mat-tree.service';
import { FileTreeNode, isFile } from '../../common/models/file-tree.model';
import { isSection } from '../../common/models/section.model';

@Component({
  selector: 'app-nav-banner',
  templateUrl: './nav-banner.component.html',
  styleUrls: ['./nav-banner.component.scss'],
})
export class NavBannerComponent implements OnInit, OnDestroy {
  private fileTreeSubscription!: Subscription;
  path!: FileTreeNode[];
  curr!: FileTreeNode;
  constructor(
    private commandService: CommandService,
    private matTreeService: MatTreeService,
    private nodeService: NodeService
  ) {}
  ngOnInit() {
    this.fileTreeSubscription = this.commandService.action$.subscribe((cmd) => {
      if (isFileCommand(cmd) && cmd.action === NodeAction.LOAD_FILE) this.path = this.matTreeService.getPath(cmd.file);
      else if (isSectionCommand(cmd) && cmd.action === NodeAction.LOAD_SECTION)
        this.path = this.matTreeService.getPath(cmd.section);
      this.curr = this.path.pop() as FileTreeNode;
    });
  }

  ngOnDestroy() {
    this.fileTreeSubscription.unsubscribe();
  }

  getIcon(node: FileTreeNode) {
    if (node) {
      if (!node.depth) return 'article';
      else return 'format_h' + node.depth;
    }
    return '';
  }

  goToNode(node: FileTreeNode) {
    console.log(node);
    if (isFile(node)) {
      this.commandService.perform({
        action: NodeAction.LOAD_FILE,
        file: node,
      });
    } else if (isSection(node)) {
      this.commandService.perform({
        action: NodeAction.LOAD_SECTION,
        section: node,
      });
    }
  }
}
