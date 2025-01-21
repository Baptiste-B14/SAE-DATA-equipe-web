import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyoubMapDuringComponent } from './ayoub-map-during.component';

describe('AyoubMapDuringComponent', () => {
  let component: AyoubMapDuringComponent;
  let fixture: ComponentFixture<AyoubMapDuringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AyoubMapDuringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AyoubMapDuringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
