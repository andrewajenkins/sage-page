import { FileTreeFile, FileTreeNode } from '../models/file-tree.model';
import { ContentSection } from '../models/section.model';
import { cloneDeep } from 'lodash';

const dummyFile: any = {
  name: '',
  parent_id: -1,
  text: '',
  type: '',
  sections: [],
  content: [],
};
const dummySection: any = {
  name: '',
  parent_id: -1,
  type: '',
  selected: false,
  content: [], // section text that goes between the name and subsections
  sections: [], // subsections to be created
  text: '',
  editable: false,
  focused: false,
  generated: false,
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
    if (!newNode.text) newNode.text = newNode.name;
    return {
      ...newNode,
      ...uniqueParams,
    };
  }

  static createSectionsFromText(text: string, id: number) {
    return text.split('\n').map((text) => {
      return NodeFactory.createSection({ name: text, text, parent_id: id });
    });
  }
}
