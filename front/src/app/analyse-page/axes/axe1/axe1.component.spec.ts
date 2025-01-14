import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Axe1Component } from './axe1.component';

describe('Axe1Component', () => {
  let component: Axe1Component;
  let fixture: ComponentFixture<Axe1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Axe1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Axe1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
