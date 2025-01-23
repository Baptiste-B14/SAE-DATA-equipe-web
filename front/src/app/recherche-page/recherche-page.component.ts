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
  loadingColumns: boolean = false;

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      table: [this.selectedTable],
      searchLines: this.fb.array([])
    });
    
    // Initialiser avec une seule ligne de recherche
    this.searchLines = [{
      id: 1,
      column: '',
      operator: '',
      value: ''
    }];
    
    this.searchService.getTables().subscribe({
      next: (tables) => {
        this.availableTables = tables;
      },
      error: (error) => {
        console.error('Error fetching tables:', error);
      }
    });
    
    this.loadColumns(this.selectedTable);
  }

  onTableChange(event: any) {
    const table = event.target.value;
    this.selectedTable = table;
    this.loadColumns(table);
  }

  loadColumns(table: string) {
    if (!table || this.loadingColumns) return;

    this.loadingColumns = true;
    this.searchService.getTableColumns(table).subscribe({
      next: (columns) => {
        this.availableColumns = columns;
        this.loadingColumns = false;
      },
      error: (error) => {
        console.error('Error loading columns:', error);
        this.loadingColumns = false;
      }
    });
  }

  get searchLinesArray() {
    return this.formGroup.get('searchLines') as FormArray;
  }

  updateSearchLine(index: number, data: any) {
    this.searchLines[index] = { ...this.searchLines[index], ...data };
  }

  request() {
    if (this.loading) return;
    
    this.loading = true;
    const filters: SearchFilter[] = this.searchLines.map(line => ({
      column: line.column,
      operator: line.operator,
      value: line.value,
      table: this.selectedTable
    }));

    this.searchService.search(filters, this.selectedTable).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.loading = false;
        this.error = '';
      },
      error: (error) => {
        console.error('Error during search:', error);
        this.error = 'Une erreur est survenue lors de la recherche.';
        this.loading = false;
      }
    });
  }
}
