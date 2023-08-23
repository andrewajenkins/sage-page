import { Injectable } from '@angular/core';
import { ContentSection, isSection } from '../../models/section.model';
import { NodeService } from '../node.service';
import { NodeAction, StateAction } from '../../models/command.model';
import { isFile } from '../../models/file-tree.model';
import { DataService } from '../data.service';
import { CommandService } from '../command.service';
import { MatTreeService } from '../mat-tree.service';
import { ServiceLogger } from '../../logger/loggers';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class TreeBuilderV3Service {
  constructor(
    private nodeService: NodeService,
    private dataService: DataService,
    private matTreeService: MatTreeService,
    private commandService: CommandService
  ) {}
  init() {
    this.commandService.action$.subscribe(async (cmd) => {
      if (cmd.action == NodeAction.GENERATE_FILE_SECTIONS) {
        const currentNode = this.nodeService.currentNode;
        if (currentNode && (isFile(currentNode) || isSection(currentNode))) {
          this.generate(currentNode as ContentSection);
          this.dataService.getFileTree().subscribe((resp) => {
            this.matTreeService.refreshTree(resp.tree);
          });
        } else
          this.commandService.perform({
            action: StateAction.NOTIFY,
            value: 'Failed to generate sections, current node is not a file or section',
          });
      }
    });
  }
  generate(parent: ContentSection) {
    const parseResult = this.parseNodes(parent);
    // adjust nodes
    // map parent_id,
    const { populatedParent, map } = this.buildMap(parseResult);
    this.matTreeService.nodeMap = map;
    this.nodeService.currentNode = parent;
    this.dataService.createSections(Array.from(map.values())).subscribe(() => {});
    return parent;
  }

  private buildMap(parent: ContentSection) {
    const map = new Map<number, ContentSection>();
    const depthMap = new Map<number, ContentSection>();
    const sections = parent.sections;
    parent.sections = [];
    depthMap.set(0, parent);
    for (let i = 0; i < sections.length; i++) {
      const node = sections[i];
      if (node.depth) {
        const localParent = this.getParent(depthMap, node.depth);
        localParent!.sections.push(node);
        node.parent_id = localParent.id as number;
        node.generated = true;
        node.type = 'heading';
        depthMap.set(node.depth, node);
        map.set(node.id as number, node);
        while (sections[i + 1] && sections[i + 1].depth == undefined) {
          const subNode = sections[++i];
          console.log('CONTENT WITH DEPTH:', subNode.depth, subNode);
          subNode.parent_id = node.id as number;
          subNode.generated = true;
          subNode.type = 'content';
          map.set(subNode.id as number, subNode);
          node.content.push(subNode);
        }
      }
    }
    return { populatedParent: parent, map };
  }
  private getParent(depthMap: Map<number, ContentSection>, depth: number): ContentSection {
    //adjust for parent depth
    const startIndex = depth ? depth - 1 : depthMap.size;
    for (let i = depth - 1; i >= 1; i--) {
      if (depthMap.has(i)) {
        return depthMap.get(i) as ContentSection;
      }
    }
    return depthMap.get(0) as ContentSection;
  }
  private parseNodes(parent: ContentSection) {
    parent.sections.forEach((node) => {
      this.parse(node);
    });
    return parent;
  }
  private parse(node: ContentSection) {
    const text = node.text;
    if (!text) return;
    if (text.startsWith('- ###### ')) {
      node.depth = 6;
      node.name = text.substring(9);
    } else if (text.startsWith('###### ')) {
      node.depth = 6;
      node.name = text.substring(7);
    } else if (text.startsWith('- ##### ')) {
      node.depth = 5;
      node.name = text.substring(8);
    } else if (text.startsWith('##### ')) {
      node.depth = 5;
      node.name = text.substring(6);
    } else if (text.startsWith('- #### ')) {
      node.depth = 4;
      node.name = text.substring(7);
    } else if (text.startsWith('#### ')) {
      node.depth = 4;
      node.name = text.substring(5);
    } else if (text.startsWith('- ### ')) {
      node.depth = 3;
      node.name = text.substring(6);
    } else if (text.startsWith('### ')) {
      node.depth = 3;
      node.name = text.substring(4);
    } else if (text.startsWith('- ## ')) {
      node.depth = 2;
      node.name = text.substring(5);
    } else if (text.startsWith('## ')) {
      node.depth = 2;
      node.name = text.substring(3);
    } else if (text.startsWith('- # ')) {
      node.depth = 1;
      node.name = text.substring(2);
    } else if (text.startsWith('# ')) {
      node.depth = 1;
      node.name = text.substring(2);
    } else if (text.startsWith('- [')) {
      node.name = text.replace(/.*\[(.*?)\.*]/g, '$1');
    } else if (text.startsWith('- ')) {
      node.name = text.substring(2);
    } else if (text.startsWith(' - ')) {
      node.name = text.substring(3);
    } else if (text.startsWith('  - ')) {
      node.name = text.substring(4);
    } else {
      node.name = text;
    }
    return node;
  }
}
