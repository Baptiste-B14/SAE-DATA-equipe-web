import { TestBed } from '@angular/core/testing';

import { GroupedbarService } from './groupedbar.service';

describe('GroupedbarService', () => {
  let service: GroupedbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupedbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
