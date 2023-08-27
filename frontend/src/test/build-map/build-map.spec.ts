import { buildMapV2, parseNodes } from '../../app/common/utils/tree-utils';
import { ContentNode } from '../../app/common/models/content-node.model';
import { deepEqualWithDebug } from '../support/test-utils';
import * as data from './golden';
import { NodeFactory } from '../../app/common/utils/node.factory';

const testsToRun = [];

describe('buildMap', () => {
  const inputKeys = Object.keys(data).filter((key) => key.includes('in'));
  const titles = inputKeys.map((key) => key.replace('in', ''));
  console.log('running titles:', titles);
  for (let title of testsToRun.length > 0 ? testsToRun : titles) {
    it(title, () => {
      const nodes = NodeFactory.createSectionsFromText(data['in' + title].trim(), 'asdf1234');
      const currentNode = getCurrentNode(nodes);
      const parseResult = parseNodes(currentNode);
      const sectionNodes = buildMapV2(parseResult);
      const expected = data['out' + title];
      expect(deepEqualWithDebug(sectionNodes, expected)).toBe(true);
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
    sections: [...data],
  } as unknown as ContentNode;
}
