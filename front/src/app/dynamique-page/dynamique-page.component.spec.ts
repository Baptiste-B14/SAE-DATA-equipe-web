import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamiquePageComponent } from './dynamique-page.component';

describe('DynamiquePageComponent', () => {
  let component: DynamiquePageComponent;
  let fixture: ComponentFixture<DynamiquePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamiquePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DynamiquePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
