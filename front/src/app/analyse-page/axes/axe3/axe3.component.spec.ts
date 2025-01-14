import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Axe3Component } from './axe3.component';

describe('Axe3Component', () => {
  let component: Axe3Component;
  let fixture: ComponentFixture<Axe3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Axe3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Axe3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
