import { TestBed } from '@angular/core/testing';

import { TreeBuilderV3Service } from './tree-builder-v3.service';

describe('TreeBuilderV3Service', () => {
  let service: TreeBuilderV3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeBuilderV3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
