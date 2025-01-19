import { TestBed } from '@angular/core/testing';

import { StackedbarService } from './stackedbar.service';

describe('StackedbarService', () => {
  let service: StackedbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StackedbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
