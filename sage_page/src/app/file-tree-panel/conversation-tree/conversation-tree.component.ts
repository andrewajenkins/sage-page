import { Component } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { CommandService } from '../../common/services/command.service';
import { ConvoAction, isValueCommand } from '../../common/models/command.model';
import { DataService } from '../../common/services/data.service';
import { ConvoNode } from '../../common/models/convo.model';
import { ContentNode } from '../../common/models/content-node.model';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
      },
    ],
  },
];

@Component({
  selector: 'app-conversation-tree',
  templateUrl: './conversation-tree.component.html',
  styleUrls: ['./conversation-tree.component.scss'],
})
export class ConversationTreeComponent {
  treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  currentConvoNode;
  constructor(private commandService: CommandService, private dataService: DataService) {
    this.dataSource.data = TREE_DATA;
  }
  ngOnInit() {
    this.commandService.action$.subscribe((cmd) => {
      if (isValueCommand(cmd) && cmd.action === ConvoAction.CREATE_FOLDER) {
        if (this.dataSource.data.length === 0)
          this.dataSource.data.push(new ConvoNode({ name: cmd.value, type: 'folder' }));
        else this.insertNode(new ConvoNode({ name: cmd.value, type: 'folder' }));
      } else {
        if (isValueCommand(cmd) && cmd.action === ConvoAction.CREATE_CONVO) {
          if (this.currentConvoNode.isFolder())
            this.currentConvoNode.chats.push(
              new ConvoNode({ name: cmd.value, type: 'convo', parent_id: this.currentConvoNode.feId })
            );
        } else if (isValueCommand(cmd) && cmd.action === ConvoAction.EDIT_NODE_NAME)
          this.currentConvoNode.name = cmd.value;
        else if (cmd.action === ConvoAction.DELETE_CURRENT_NODE) {
          this.deleteConvoNode(this.currentConvoNode);
          this.currentConvoNode = undefined;
        }
      }
    });
  }
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  convoSelect(node) {
    this.currentConvoNode = node;
  }

  private deleteConvoNode(currentConvoNode) {}

  insertNode(newNode: ConvoNode) {
    if (!this.currentConvoNode) this.dataSource.data.push(newNode);
    else this.currentConvoNode.nodes.push(newNode);
  }
}
