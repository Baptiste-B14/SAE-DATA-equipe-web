import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedbarChartCustomComponent } from './stackedbar-chart-custom.component';

describe('StackedbarChartCustomComponent', () => {
  let component: StackedbarChartCustomComponent;
  let fixture: ComponentFixture<StackedbarChartCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackedbarChartCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StackedbarChartCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
