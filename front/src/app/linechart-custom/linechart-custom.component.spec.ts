import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinechartCustomComponent } from './linechart-custom.component';

describe('LinechartCustomComponent', () => {
  let component: LinechartCustomComponent;
  let fixture: ComponentFixture<LinechartCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinechartCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinechartCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
