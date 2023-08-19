import { TestBed } from '@angular/core/testing';

import { TreeBuilderV2MapperService } from './tree-builder-v2-mapper.service';

describe('TreeBuilderV2MapperService', () => {
  let service: TreeBuilderV2MapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeBuilderV2MapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
