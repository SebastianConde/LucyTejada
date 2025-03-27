import { TestBed } from '@angular/core/testing';

import { LlamarBackendService } from './llamar-backend.service';

describe('LlamarBackendService', () => {
  let service: LlamarBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LlamarBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
