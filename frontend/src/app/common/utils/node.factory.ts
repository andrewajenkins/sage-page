import { FileTreeNode } from '../models/file-tree.model';
import { Token } from '../parsers/file-tree-builder.service';
import { ContentSection, ContentSectionType } from '../models/section.model';

export const dummyFile = {
  name: '',
  parent_id: -1,
  parent_type: '',
  text: [],
  textType: Token.CONTENT,
  type: '',
  sections: [],
  content: [],
};
export const dummySection = {
  name: '',
  parent_id: -1,
  parent_type: '',
  type: '',
  contentType: ContentSectionType.NONE,
  selected: false,
  content: [], // section text that goes between the name and subsections
  sections: [], // subsections to be created
  textType: -1,
};

export class NodeFactory {
  static createNode(uniqueParams: Partial<FileTreeNode>): FileTreeNode {
    return {
      ...dummyFile,
      ...uniqueParams,
    };
  }

  static createFile(uniqueParams: Partial<FileTreeNode>) {
    const newNode = dummyFile;
    newNode.type = 'file';
    return {
      ...newNode,
      ...uniqueParams,
    };
  }

  static createSection(uniqueParams: Partial<ContentSection>): ContentSection {
    const newNode = dummySection;
    newNode.type = 'section';
    return {
      ...newNode,
      ...uniqueParams,
    };
  }
}
