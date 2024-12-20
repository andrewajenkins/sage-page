import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommandService } from '../../common/services/command.service';
import { Subscription } from 'rxjs';
import { NodeAction, isNodeCommand } from '../../common/models/command.model';
import { getPath } from '../../common/utils/tree-utils';
import { ContentNode } from '../../common/models/content-node.model';
import { TreeService } from '../../common/services/tree.service';

@Component({
  selector: 'app-nav-banner',
  templateUrl: './nav-banner.component.html',
  styleUrls: ['./nav-banner.component.scss'],
})
export class NavBannerComponent implements OnInit, OnDestroy {
  private fileTreeSubscription!: Subscription;
  path!: ContentNode[];
  curr!: ContentNode;
  constructor(private commandService: CommandService, private treeService: TreeService) {}
  ngOnInit() {
    this.fileTreeSubscription = this.commandService.action$.subscribe((cmd) => {
      if (isNodeCommand(cmd) && cmd.action === NodeAction.LOAD_NODE)
        this.path = getPath(cmd.node, this.treeService.nodeMap);
      this.curr = this.path?.pop() as ContentNode;
    });
  }
  ngOnDestroy() {
    this.fileTreeSubscription.unsubscribe();
  }
  getIcon(node: ContentNode) {
    if (node) {
      if (!node.depth) return 'article';
      else return 'format_h' + node.depth;
    }
    return '';
  }
  goToNode(node: ContentNode) {
    this.commandService.perform({
      action: NodeAction.LOAD_NODE,
      node: node,
    });
  }
}
