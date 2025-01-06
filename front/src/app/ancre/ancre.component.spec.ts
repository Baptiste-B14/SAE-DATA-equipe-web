import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AncreComponent } from './ancre.component';

describe('AncreComponent', () => {
  let component: AncreComponent;
  let fixture: ComponentFixture<AncreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AncreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AncreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
