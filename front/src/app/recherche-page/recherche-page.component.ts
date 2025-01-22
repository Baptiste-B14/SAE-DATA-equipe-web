import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ResultatsPageRechercheComponent } from '../resultats-page-recherche/resultats-page-recherche.component';
import { SearchLineComponent } from '../search-line/search-line.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchFilter } from '../services/recherche.service';

@Component({
  selector: 'app-recherche-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ResultatsPageRechercheComponent, SearchLineComponent],
  templateUrl: './recherche-page.component.html',
  styleUrls: ['./recherche-page.component.scss']
})
export class RecherchePageComponent implements OnInit {
  searchLines: any[] = [];
  formGroup!: FormGroup;
  searchResults: any[] = [];
  selectedTable: string = 'Publication'; // Default table
  availableTables: string[] = ['Publication']; // Default value
  availableColumns: string[] = []; // Default value
  error: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      table: [this.selectedTable],
      searchLines: this.fb.array([])
    });
    
    this.addSearchLine();
    
    this.searchService.getTables().subscribe(
      tables => {
        this.availableTables = tables;
      },
      error => {
        console.error('Error fetching tables:', error);
      }
    );
    
    this.loadColumns(this.selectedTable);
  }

  get searchLinesArray() {
    return this.formGroup.get('searchLines') as FormArray;
  }

  addSearchLine() {
    const searchLineGroup = this.fb.group({
      column: [''],
      operator: ['EQUALS'],
      value: ['']
    });
  
    this.searchLinesArray.push(searchLineGroup);
    this.searchLines.push({ 
      id: this.searchLines.length,
      column: '', // by default
      operator: 'EQUALS',
      value: ''
    });
  }

  removeSearchLine(index: number) {
    this.searchLinesArray.removeAt(index);
    this.searchLines.splice(index, 1);
  }

  updateSearchLine(index: number, data: any) {
    this.searchLines[index] = { ...this.searchLines[index], ...data };
  }

  onTableChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedTable = select.value;
    
    // Reset all search lines when table changes
    this.searchLines = [];
    this.searchLinesArray.clear();
    this.addSearchLine(); // Add one default search line
    
    this.loadColumns(this.selectedTable);
  }

  loadColumns(tableName: string) {
    this.searchService.getTableColumns(tableName).subscribe({
      next: (columns) => {
        this.availableColumns = columns;
        if (columns.length > 0) {
          this.searchLines[0].column = columns[0];
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des colonnes:', error);
      }
    });
  }

  request() {
    this.loading = true;
    this.error = '';

    console.log(this.selectedTable)
    
    const filters: SearchFilter[] = this.searchLines.map(line => ({
      column: line.column,
      operator: line.operator,
      value: line.value,
      table : this.selectedTable
    }));

    this.searchService.search(filters, this.selectedTable).subscribe(
      results => {
        this.searchResults = results;
        this.loading = false;
      },
      error => {
        console.error('Search error:', error);
        this.error = 'An error occurred while searching. Please try again.';
        this.loading = false;
      }
    );
  }
}
