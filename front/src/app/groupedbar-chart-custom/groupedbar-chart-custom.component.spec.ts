import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedbarChartCustomComponent } from './groupedbar-chart-custom.component';

describe('GroupedbarChartCustomComponent', () => {
  let component: GroupedbarChartCustomComponent;
  let fixture: ComponentFixture<GroupedbarChartCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupedbarChartCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupedbarChartCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
