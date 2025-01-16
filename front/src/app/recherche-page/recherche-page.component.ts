import { Component, OnInit } from '@angular/core';
import { SearchLineComponent } from '../search-line/search-line.component'
import { ResultatsPageRechercheComponent } from '../resultats-page-recherche/resultats-page-recherche.component'
@Component({
  selector: 'app-recherche-page',
  standalone: true,
  imports: [SearchLineComponent, ResultatsPageRechercheComponent],
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

  request(){
    console.log("submit");
    
  }
  
}
