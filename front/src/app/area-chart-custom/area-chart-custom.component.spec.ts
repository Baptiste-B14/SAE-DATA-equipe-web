import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaChartCustomComponent } from './area-chart-custom.component';

describe('AreaChartCustomComponent', () => {
  let component: AreaChartCustomComponent;
  let fixture: ComponentFixture<AreaChartCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaChartCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaChartCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
