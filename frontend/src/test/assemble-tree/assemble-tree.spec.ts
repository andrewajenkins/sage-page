import { assembleTree } from '../../app/common/utils/tree-utils';
import * as input from './input-output/basic-in';
import * as output from './input-output/basic-out';
import { deepEqualWithDebug } from '../support/test-utils';

const titlesToRun = []; //['RootFileHeadersContent'];

describe('assembleTree', () => {
  const inputs = Object.keys(input);
  const titles = inputs.map((key) => key.replace('in', ''));
  console.log('running titles:', titles);
  for (let title of titlesToRun.length > 0 ? titlesToRun : titles) {
    it(title, () => {
      const { nodeMap, rootNodes } = assembleTree(input['in' + title]);
      const expected = output['out' + title];
      expect(deepEqualWithDebug(rootNodes, expected)).toBe(true);
    });
  }
});
