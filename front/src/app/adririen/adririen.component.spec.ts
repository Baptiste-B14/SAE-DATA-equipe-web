import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdririenComponent } from './adririen.component';

describe('AdririenComponent', () => {
  let component: AdririenComponent;
  let fixture: ComponentFixture<AdririenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdririenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdririenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
