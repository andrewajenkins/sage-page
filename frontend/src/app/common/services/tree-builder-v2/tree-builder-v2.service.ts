import { Injectable } from '@angular/core';
import { ContentSection } from '../../models/section.model';
import { FileTreeFile } from '../../models/file-tree.model';
import { marked, TokensList } from 'marked';
import { ServiceLogger } from '../../logger/loggers';
import { TreeBuilderV2MapperService } from './tree-builder-v2-mapper.service';
import { TreeBuilderV2BuilderService } from './tree-builder-v2-builder.service';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class TreeBuilderV2Service {
  headers = ['#', '##', '###', '####', '#####', '######', '', 'NONE'];
  constructor(private mapper: TreeBuilderV2MapperService, private builder: TreeBuilderV2BuilderService) {}

  update(rootNode: FileTreeFile | ContentSection) {
    const result = this.doUpdate(rootNode, rootNode);
  }

  private doUpdate(parentNode, rootNode) {
    const docString: string = this.getDocString(parentNode);
    const lexResult: TokensList = marked.lexer(docString);
    const flattenResult: any = this.flattenResults(lexResult);
    const annotatedNodes: ContentSection[] = this.mapper.mapTokensToNodes(flattenResult, [
      ...parentNode.content,
      ...parentNode.sections,
    ]);
    const { docNodes, parent } = this.getParentContent(annotatedNodes, parentNode);
    const adjustedNodes: ContentSection[] = this.adjustNodes(docNodes, parent);
    const newTrees = this.builder.buildTree(adjustedNodes, rootNode);
    const updatedParentNode: ContentSection = this.replaceNode(parent, newTrees);
    return updatedParentNode;
  }

  private flattenResults(lexResult: TokensList) {
    const result: any[] = [];
    const flatten = (section): any => {
      if (section.type === 'list') {
        section.items.forEach((item) => {
          result.push(item);
          const subTokens = item?.tokens[0]?.tokens;
          if (subTokens.length > 2) {
            subTokens.shift();
            subTokens.shift();
            subTokens.forEach((token) => {
              result.push(token);
            });
          }
        });
      } else if (section.type === 'paragraph') {
        section.tokens.forEach((token) => {
          result.push(token);
        });
      } else {
        result.push(section);
      }
    };
    lexResult.forEach((section) => {
      flatten(section);
    });
    return result;
  }

  private getParentContent(annotatedNodes: ContentSection[], parent: ContentSection): any {
    const contentTypes = ['paragraph', 'list'];
    // for (let node of annotatedNodes) {
    let index = 0;
    while (index < annotatedNodes.length) {
      const node = annotatedNodes[index];
      if (node.lexType && contentTypes.indexOf(node.lexType) !== -1) {
        parent.content.push(annotatedNodes.shift() as ContentSection);
      } else break;
    }
    return { docNodes: annotatedNodes, parent };
  }

  private getDocString(parent: ContentSection): string {
    const contentString = parent.content.map((content) => content.text).join('  \n');
    const sectionString = parent.sections.map((section) => section.text).join('  \n');
    const docString = contentString + '  \n' + sectionString;
    return docString;
  }

  private replaceNode(parent: ContentSection, newTrees: ContentSection[]) {
    parent.sections = newTrees;
    this.handleContentSectionChange(parent);
    return parent;
  }

  handleContentSectionChange(parent: ContentSection) {
    const sectionIds = parent.sections.map((section) => section.id);
    parent.content = parent.content.filter((content) => sectionIds.indexOf(content.id) === -1);
  }
  private adjustNodes(docNodes: ContentSection[], parent: ContentSection) {
    docNodes = this.adjustForDoc(docNodes);
    docNodes = this.adjustForParent(docNodes, parent);

    return docNodes;
  }
  adjustForDoc(docNodes): ContentSection[] {
    // adjust for max
    let minDepth = 100;
    docNodes.forEach((node) => {
      if (node.depth && node.depth < minDepth) {
        minDepth = node.depth;
      }
    });
    minDepth--;
    docNodes.forEach((node) => {
      if (node.depth) {
        node.depth -= minDepth;
      }
    });
    // adjust for min
    let parentDepth = minDepth;
    docNodes.forEach((node) => {
      if (node.depth && node.depth > parentDepth + 1) {
        node.depth = parentDepth + 1;
      }
      parentDepth = node.depth;
    });
    return docNodes;
  }
  adjustForParent(docNodes, parent): ContentSection[] {
    const offset = 7 - parent.textType;
    for (let node of docNodes) {
      if (!!node.depth && node.depth > -1) {
        node.lexDepth = node.depth;
        node.depth += offset;
        this.rewriteSymbols(node);
      }
    }
    return docNodes;
  }
  rewriteSymbols(node: ContentSection) {
    if (node.type === 'heading' && node.text && node.depth) {
      node.name = node.name.replace(/^[#]+/, '').trim();
      node.text = node.text.replace(/^[#]+/, '').trim();
      node.text = this.headers[node.depth - 1] + ' ' + node.text;
      console.log('rewriteSymbols: result:', node);
    }
  }
}
