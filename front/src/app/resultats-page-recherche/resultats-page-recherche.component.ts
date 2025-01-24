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

  // Définition de l'ordre des colonnes
  columnOrder = [
    'person_id',
    'person_name',
    'city_dblp',
    'city_orcid',
    'country_dblp',
    'country_orcid',
    'orcid',
    'school_dblp',
    'school_orcid'
  ];

  // Méthode pour obtenir les clés dans l'ordre souhaité
  getOrderedKeys(): string[] {
    if (!this.results || this.results.length === 0) return [];
    return this.columnOrder.filter(key => key in this.results[0]);
  }

  // Méthode pour obtenir les valeurs dans l'ordre des colonnes
  getOrderedValues(row: any): any[] {
    return this.columnOrder
      .filter(key => key in row)
      .map(key => row[key]);
  }
}