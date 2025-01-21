import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyoubMapAfterComponent } from './ayoub-map-after.component';

describe('AyoubMapAfterComponent', () => {
  let component: AyoubMapAfterComponent;
  let fixture: ComponentFixture<AyoubMapAfterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AyoubMapAfterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AyoubMapAfterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
