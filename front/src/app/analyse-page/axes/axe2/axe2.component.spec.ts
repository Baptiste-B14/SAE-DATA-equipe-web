import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Axe2Component } from './axe2.component';

describe('Axe2Component', () => {
  let component: Axe2Component;
  let fixture: ComponentFixture<Axe2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Axe2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Axe2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
