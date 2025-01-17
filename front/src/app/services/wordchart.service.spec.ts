import { TestBed } from '@angular/core/testing';

import { WordchartService } from './wordchart.service';

describe('WordchartService', () => {
  let service: WordchartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordchartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
