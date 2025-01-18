import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiechartCustomSimpleComponent } from './piechart-custom-simple.component';

describe('PiechartCustomSimpleComponent', () => {
  let component: PiechartCustomSimpleComponent;
  let fixture: ComponentFixture<PiechartCustomSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiechartCustomSimpleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiechartCustomSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
