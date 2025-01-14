import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordChartComponent } from './word-chart.component';

describe('WordChartComponent', () => {
  let component: WordChartComponent;
  let fixture: ComponentFixture<WordChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
