import * as input from './input-output/basic-in';
import * as output from './input-output/basic-out';
import { deepEqualWithDebug } from '../support/test-utils';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileTreeComponent } from '../../app/file-tree-panel/file-tree/file-tree.component';
import { AppModule } from '../../app/app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TreeBuilderV6Service } from '../../app/common/services/tree-builder-v6.service';
import { TreeService } from '../../app/common/services/tree.service';
import { CommandService } from '../../app/common/services/command.service';
import { FileTreeActionHandler } from '../../app/file-tree-panel/file-tree/file-tree-action-handler';
import { DataService } from '../../app/common/services/data.service';
import { of } from 'rxjs';

const titlesToRun = []; //['RootFileHeadersContent'];
describe('assembleTree', () => {
  let builderService: TreeBuilderV6Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileTreeComponent],
      imports: [AppModule, HttpClientTestingModule],
      providers: [TreeBuilderV6Service],
    });
    builderService = TestBed.inject(TreeBuilderV6Service);
    TestBed.createComponent(FileTreeComponent);
  });

  const inputs = Object.keys(input);
  const titles = inputs.map((key) => key.replace('in', ''));
  console.log('running titles:', titles);
  for (let title of titlesToRun.length > 0 ? titlesToRun : titles) {
    it(title, () => {
      const { nodeMap, rootNodes } = builderService.assembleTree(input['in' + title]);
      const expected = output['out' + title];
      expect(deepEqualWithDebug(rootNodes, expected)).toBe(true);
    });
  }
});
