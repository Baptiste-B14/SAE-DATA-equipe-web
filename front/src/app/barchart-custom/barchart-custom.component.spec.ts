import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarchartCustomComponent } from './barchart-custom.component';

describe('BarchartCustomComponent', () => {
  let component: BarchartCustomComponent;
  let fixture: ComponentFixture<BarchartCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarchartCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarchartCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
