import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinechartColorComponent } from './linechart-color.component';

describe('LinechartColorComponent', () => {
  let component: LinechartColorComponent;
  let fixture: ComponentFixture<LinechartColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinechartColorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinechartColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
