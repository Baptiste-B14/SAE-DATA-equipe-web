import { TestBed } from '@angular/core/testing';

import { AreaChartService } from './area-chart.service';

describe('AreaChartService', () => {
  let service: AreaChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreaChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
