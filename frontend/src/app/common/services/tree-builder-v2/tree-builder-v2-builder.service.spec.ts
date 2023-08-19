import { TestBed } from '@angular/core/testing';

import { TreeBuilderV2BuilderService } from './tree-builder-v2-builder.service';

describe('TreeBuilderV2BuilderService', () => {
  let service: TreeBuilderV2BuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeBuilderV2BuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
