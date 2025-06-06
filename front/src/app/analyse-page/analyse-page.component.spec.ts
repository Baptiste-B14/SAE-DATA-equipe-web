import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysePageComponent } from './analyse-page.component';

describe('AnalysePageComponent', () => {
  let component: AnalysePageComponent;
  let fixture: ComponentFixture<AnalysePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnalysePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
