import { TestBed } from '@angular/core/testing';

import { TreeBuilderV2Service } from './tree-builder-v2.service';

describe('TreeBuilderV2Service', () => {
  let service: TreeBuilderV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeBuilderV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
