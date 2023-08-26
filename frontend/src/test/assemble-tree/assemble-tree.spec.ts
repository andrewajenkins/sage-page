import { assembleTree } from '../../app/common/utils/tree-utils';
import * as input from './input-output/basic-in';
import * as output from './input-output/basic-out';
import { deepEqualWithDebug } from '../support/utils';

describe('assembleTree', () => {
  const inputs = Object.keys(input);
  const outputs = Object.keys(output);
  const titles = inputs.map((key) => key.replace('in', ''));
  console.log('running titles:', titles);
  for (let title of titles) {
    it(title, () => {
      const { nodeMap, rootNodes } = assembleTree(input['in' + title]);
      expect(deepEqualWithDebug(rootNodes, output['out' + title])).toBe(true);
    });
  }
});
