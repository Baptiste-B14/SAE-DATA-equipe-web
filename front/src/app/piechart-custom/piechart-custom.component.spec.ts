import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiechartCustomComponent } from './piechart-custom.component';

describe('PiechartCustomComponent', () => {
  let component: PiechartCustomComponent;
  let fixture: ComponentFixture<PiechartCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiechartCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiechartCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
