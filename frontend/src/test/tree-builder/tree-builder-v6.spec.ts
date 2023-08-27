import { TestBed } from '@angular/core/testing';
import { TreeBuilderV6Service } from '../../app/common/services/tree-builder-v6.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from '../../app/app.module';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

class DataService {}

describe('TreeBuilderV6Service', () => {
  let service: TreeBuilderV6Service;

  beforeEach(() => {
    // TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
    TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule],
      providers: [TreeBuilderV6Service, { provide: DataService, useValue: {} }],
    });
    service = TestBed.inject(TreeBuilderV6Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add two numbers', () => {});
});
