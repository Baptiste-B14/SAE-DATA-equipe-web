import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleChartCustomComponent } from './bubble-chart-custom.component';

describe('BubbleChartCustomComponent', () => {
  let component: BubbleChartCustomComponent;
  let fixture: ComponentFixture<BubbleChartCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BubbleChartCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BubbleChartCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
