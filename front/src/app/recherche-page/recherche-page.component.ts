import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  selectedTable: string = '';
  availableTables: string[] = [];
  availableColumns: string[] = [];
  error: string = '';
  loading: boolean = false;
  loadingColumns: boolean = false;

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadTables();
  }

  private initializeForm() {
    this.formGroup = this.fb.group({
      table: [''],
      searchLines: this.fb.array([])
    });
    
    this.searchLines = [{
      id: 1,
      column: '',
      operator: '',
      value: ''
    }];
  }

  private loadTables() {
    this.searchService.getTables().subscribe({
      next: (tables) => {
        this.availableTables = tables;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching tables:', error);
        this.error = 'Erreur lors du chargement des tables.';
        this.cdr.detectChanges();
      }
    });
  }

  onTableChange(event: any) {
    const table = event.target.value;
    this.selectedTable = table;
    if (table) {
      this.loadColumns(table);
    } else {
      this.availableColumns = [];
      this.cdr.detectChanges();
    }
  }

  loadColumns(table: string) {
    if (!table || this.loadingColumns) return;

    this.loadingColumns = true;
    this.searchService.getTableColumns(table).subscribe({
      next: (columns) => {
        this.availableColumns = columns;
        this.loadingColumns = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading columns:', error);
        this.loadingColumns = false;
        this.error = 'Erreur lors du chargement des colonnes.';
        this.cdr.detectChanges();
      }
    });
  }

  get searchLinesArray() {
    return this.formGroup.get('searchLines') as FormArray;
  }

  updateSearchLine(index: number, data: any) {
    this.searchLines[index] = { ...this.searchLines[index], ...data };
    this.cdr.detectChanges();
  }

  request() {
    if (this.loading) return;
    
    if (!this.selectedTable) {
      this.error = 'Veuillez sélectionner une table avant de lancer la recherche.';
      this.cdr.detectChanges();
      return;
    }

    const hasValidCriteria = this.searchLines.some(line => 
      line.column && line.operator && line.value
    );

    if (!hasValidCriteria) {
      this.error = 'Veuillez remplir au moins un critère de recherche complet (colonne, opérateur et valeur).';
      this.cdr.detectChanges();
      return;
    }
    
    this.loading = true;
    this.error = '';

    const filters: SearchFilter[] = this.searchLines
      .filter(line => line.column && line.operator && line.value)
      .map(line => ({
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
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error during search:', error);
        this.error = error.error?.message || 'Une erreur est survenue lors de la recherche. Veuillez vérifier vos critères.';
        this.loading = false;
        this.searchResults = [];
        this.cdr.detectChanges();
      }
    });
  }
}
