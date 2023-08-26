import { buildMapV2, parseNodes } from '../../app/common/utils/tree-utils';
import { ContentSection } from '../../app/common/models/section.model';
import { deepEqualWithDebug } from '../support/utils';
import * as data from './golden';
import { NodeFactory } from '../../app/common/utils/node.factory';

describe('buildMap', () => {
  const inputKeys = Object.keys(data).filter((key) => key.includes('in'));
  const titles = inputKeys.map((key) => key.replace('in', ''));
  console.log('running titles:', titles);
  for (let title of titles) {
    it(title, () => {
      const nodes = NodeFactory.createSectionsFromText(data['in' + title].trim(), 0);
      const currentNode = getCurrentNode(nodes);
      const parseResult = parseNodes(currentNode);
      const sectionNodes = buildMapV2(parseResult);
      const expected = data['out' + title];
      expect(deepEqualWithDebug(expected, sectionNodes)).toBe(true);
    });
  }
});
function getCurrentNode(data) {
  return {
    id: 1,
    type: 'file',
    parent_id: 0,
    name: 'sub-file',
    depth: 0,
    contents: [],
    sections: [...data],
  } as unknown as ContentSection;
}
