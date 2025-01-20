import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyoubMapBeforeComponent } from './ayoub-map-before.component';

describe('AyoubMapBeforeComponent', () => {
  let component: AyoubMapBeforeComponent;
  let fixture: ComponentFixture<AyoubMapBeforeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AyoubMapBeforeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AyoubMapBeforeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
