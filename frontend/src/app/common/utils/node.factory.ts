import { FileTreeNode } from '../models/file-tree.model';
import { Token } from '../parsers/file-tree-builder.service';
import { ContentSection, ContentSectionType } from '../models/section.model';
import { cloneDeep } from 'lodash';

const dummyFile = {
  name: '',
  parent_id: -1,
  parent_type: '',
  text: '',
  textType: Token.CONTENT,
  type: '',
  sections: [],
  content: [],
};
const dummySection = {
  name: '',
  parent_id: -1,
  parent_type: '',
  type: '',
  contentType: ContentSectionType.NONE,
  selected: false,
  content: [], // section text that goes between the name and subsections
  sections: [], // subsections to be created
  textType: -1,
  text: '',
  editable: false,
};
export function getDummyFile() {
  return cloneDeep(dummyFile);
}
export class NodeFactory {
  static createNode(uniqueParams: Partial<FileTreeNode>): FileTreeNode {
    return {
      ...getDummyFile(),
      ...uniqueParams,
    };
  }

  static createFile(uniqueParams: Partial<FileTreeNode>) {
    const newNode = getDummyFile();
    newNode.type = 'file';
    return {
      ...newNode,
      ...uniqueParams,
    };
  }

  static createSection(uniqueParams: Partial<ContentSection>): ContentSection {
    const newNode = cloneDeep(dummySection);
    newNode.type = 'section';
    // newNode.sections = [];
    // newNode.content = [];
    return {
      ...newNode,
      ...uniqueParams,
    };
  }
}
