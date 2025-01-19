/*import { Component } from '@angular/core';

@Component({
  selector: 'app-resultats-page-recherche',
  standalone: true,
  imports: [],
  templateUrl: './resultats-page-recherche.component.html',
  styleUrl: './resultats-page-recherche.component.scss'
})
export class ResultatsPageRechercheComponent {

}
*/
// resultats-page-recherche.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-resultats-page-recherche',
  standalone: true,
  templateUrl: './resultats-page-recherche.component.html',
  styleUrls: ['./resultats-page-recherche.component.scss']
})
export class ResultatsPageRechercheComponent {
  @Input() results: any[] = [];
  
  // Add Object to component class to make it available in template
  protected readonly Object = Object;
}