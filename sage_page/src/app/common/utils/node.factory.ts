import { ContentNode } from '../models/content-node.model';
import { cloneDeep } from 'lodash';

const dummyFile: any = {
  name: '',
  parent_id: -1,
  text: '',
  type: '',
  sections: [],
  contents: [],
};
const dummySection: any = {
  name: '',
  parent_id: -1,
  type: '',
  selected: false,
  contents: [], // section text that goes between the name and subsections
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
  static createNode(uniqueParams: Partial<ContentNode>): ContentNode {
    return {
      ...getDummyFile(),
      ...uniqueParams,
    };
  }

  static createFile(uniqueParams: Partial<ContentNode>) {
    const newNode = getDummyFile();
    newNode.type = 'file';
    return {
      ...newNode,
      ...uniqueParams,
    };
  }

  static createSection(uniqueParams: Partial<ContentNode>): ContentNode {
    const newNode = cloneDeep(dummySection);
    newNode.type = 'section';
    if (!newNode.text) newNode.text = newNode.name;
    return {
      ...newNode,
      ...uniqueParams,
    };
  }

  static createSectionsFromText(inputText: string, feId: string, dynamicIds: boolean = false) {
    const newSections: ContentNode[] = [];
    const sectionArrays = inputText.trim().split('\n');
    for (let i = 0; i < sectionArrays.length; i++) {
      const text = sectionArrays[i];
      if (dynamicIds) newSections.push(new ContentNode({ name: text, text, feId: feId + '_' + i }));
      else newSections.push(new ContentNode({ name: text, text, parent_id: feId }));
    }
    return newSections.filter((node) => node.text && node.name !== 'DEFAULT_NAME');
  }
}
