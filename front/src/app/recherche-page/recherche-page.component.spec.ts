import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecherchePageComponent } from './recherche-page.component';

describe('RecherchePageComponent', () => {
  let component: RecherchePageComponent;
  let fixture: ComponentFixture<RecherchePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecherchePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecherchePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
