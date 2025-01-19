
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchService } from '../services/recherche.service';

@Component({
  selector: 'app-search-line',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-line.component.html',
  styleUrls: ['./search-line.component.scss']
})
export class SearchLineComponent implements OnChanges {
  @Input() formGroup!: FormGroup;
  @Input() searchLineId!: number;
  @Input() isFirst: boolean = false;
  @Input() isLast: boolean = false;
  @Input() column: string = '';
  @Input() operator: string = 'EQUALS';
  @Input() value: string = '';
  @Input() selectedTable: string = '';

  @Output() onAdd = new EventEmitter<void>();
  @Output() onRemove = new EventEmitter<number>();
  @Output() onUpdate = new EventEmitter<any>();

  columns: string[] = [];
  operators = ['EQUALS', 'LIKE', 'GT', 'LT', 'GTE', 'LTE'];

  constructor(private searchService: SearchService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedTable'] && this.selectedTable) {
      this.loadColumns();
    }
  }

  loadColumns() {
    this.searchService.getTableColumns(this.selectedTable).subscribe(
      columns => {
        this.columns = columns;
        if (columns.length > 0 && !this.column) {
          this.column = columns[0];
          this.emitUpdate();
        }
      },
      error => {
        console.error('Error loading columns:', error);
      }
    );
  }

  changeOperator(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.operator = select.value;
    this.emitUpdate();
  }

  updateColumn(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.column = select.value;
    this.emitUpdate();
  }

  updateValue(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.emitUpdate();
  }

  private emitUpdate() {
    this.onUpdate.emit({
      column: this.column,
      operator: this.operator,
      value: this.value
    });
  }

  addSearchLine() {
    this.onAdd.emit();
  }

  removeSearchLine() {
    this.onRemove.emit(this.searchLineId);
  }
}
/*import { Component, Input, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
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
  public searchlines = RecherchePageComponent.searchlines

  addNew(){   
    this.searchlines.push(new SearchLineComponent);  
  }

  remove(){
    if (this.searchLineId != 0) {
      this.searchlines.splice(this.searchLineId, 1)
    }
  }

  getSelectedOperator(){
    let actualValue = document.getElementById('selected-operator-value-'+this.searchLineId) as HTMLInputElement;
    console.log(actualValue.value);
    
    return actualValue.value; 
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
}*/
