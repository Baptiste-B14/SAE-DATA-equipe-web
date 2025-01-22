import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePlusLoinComponent } from './page-plus-loin.component';

describe('PagePlusLoinComponent', () => {
  let component: PagePlusLoinComponent;
  let fixture: ComponentFixture<PagePlusLoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagePlusLoinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagePlusLoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
