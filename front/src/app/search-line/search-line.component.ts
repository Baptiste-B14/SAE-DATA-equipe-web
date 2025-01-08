import { Component, Input, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { RecherchePageComponent } from '../recherche-page/recherche-page.component';


@Component({
  selector: 'app-search-line',
  standalone: true,
  imports: [],
  templateUrl: './search-line.component.html',
  styleUrl: './search-line.component.scss'
})
export class SearchLineComponent {
  @Input() searchLineId! : number;

  addNew(){
    RecherchePageComponent.searchlines.push(new SearchLineComponent);  
  }

  remove(){
    if (this.searchLineId != 0) {
      RecherchePageComponent.searchlines.splice(this.searchLineId, 1)
    }
  }

  changeOperatorVisualization(value:string) {    
    let actualValue = document.getElementById('selected-operator-value-'+this.searchLineId) as HTMLInputElement;
    let actualValueVisu = document.getElementById('selected-operator-visualization-'+this.searchLineId);
    if (actualValue && actualValueVisu) {
      switch (value) {
        case 'EQUALS':
          actualValue.value = "EQUALS";
          actualValueVisu.className = "dropdown-button fa-solid fa-equals"
          break;
        case 'LIKE':
          actualValue.value = "LIKE";
          actualValueVisu.className = "dropdown-button fa-solid fa-percent"
          break;
        case 'GT':
          actualValue.value = "GT";
          actualValueVisu.className = "dropdown-button fa-solid fa-greater-than"
          break;
        case 'LT':
          actualValue.value = "LT";
          actualValueVisu.className = "dropdown-button fa-solid fa-less-than"
          break;
        case 'GTE':
          actualValue.value = "GTE";
          actualValueVisu.className = "dropdown-button fa-solid fa-greater-than-equal"
          break;
        case 'LTE':
          actualValue.value = "LTE";
          actualValueVisu.className = "dropdown-button fa-solid fa-less-than-equal"
          break;
      
        default:
          break;
      }
    }else{
      console.error("Pas d'objet input")
    }
  }
}
