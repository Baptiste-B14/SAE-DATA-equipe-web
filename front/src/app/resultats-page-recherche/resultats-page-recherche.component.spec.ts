import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatsPageRechercheComponent } from './resultats-page-recherche.component';

describe('ResultatsPageRechercheComponent', () => {
  let component: ResultatsPageRechercheComponent;
  let fixture: ComponentFixture<ResultatsPageRechercheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultatsPageRechercheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultatsPageRechercheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
