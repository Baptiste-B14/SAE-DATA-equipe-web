import { Component, OnInit } from '@angular/core';
import { SearchLineComponent } from '../search-line/search-line.component'
@Component({
  selector: 'app-recherche-page',
  standalone: true,
  imports: [SearchLineComponent],
  templateUrl: './recherche-page.component.html',
  styleUrl: './recherche-page.component.scss'
})
export class RecherchePageComponent {
  static searchlines : SearchLineComponent[];

  constructor(){
    RecherchePageComponent.searchlines = [];
    RecherchePageComponent.searchlines.push(new SearchLineComponent);
  }

  
  get staticSearchlines() {
    return  RecherchePageComponent.searchlines;
  }
  
}
