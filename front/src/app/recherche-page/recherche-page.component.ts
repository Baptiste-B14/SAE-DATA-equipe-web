
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, FormsModule} from '@angular/forms';
import { ResultatsPageRechercheComponent } from '../resultats-page-recherche/resultats-page-recherche.component';
import { SearchLineComponent } from '../search-line/search-line.component';
import { CommonModule } from '@angular/common';
import { SearchService, SearchFilter } from '../services/recherche.service';

@Component({
  selector: 'app-recherche-page',
  standalone: true,
  imports: [CommonModule, ResultatsPageRechercheComponent, SearchLineComponent, FormsModule],
  templateUrl: './recherche-page.component.html',
  styleUrls: ['./recherche-page.component.scss']
})
export class RecherchePageComponent implements OnInit {
  searchLines: any[] = [];
  formGroup!: FormGroup;
  searchResults: any[] = [];
  selectedTable: string = 'Publication'; // Default table
  availableTables: string[] = ['Publication']; // Default value
  error: string = '';
  loading: boolean = false;
  isImageVisible = false;
  // Add a ViewChild reference to the results section
  @ViewChild('resultsSection') resultsSection!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.selectedTable = ''; // Set to empty initially
  
    this.formGroup = this.fb.group({
      table: [this.selectedTable],
      searchLines: this.fb.array([])
    });
  
    this.searchService.getTables().subscribe(
      tables => {
        this.availableTables = tables;
      },
      error => {
        console.error('Error fetching tables:', error);
      }
    );
    this.scrollToTop();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Méthode pour afficher l'image
  showImage() {
    this.isImageVisible = true;
  }

  // Méthode pour cacher l'image
  hideImage() {
    this.isImageVisible = false;
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
  
    // Remove the empty string option from availableTables
    this.availableTables = this.availableTables.filter(table => table !== '');
  
    // Reset all search lines when table changes
    this.searchLines = [];
    this.searchLinesArray.clear();
    this.addSearchLine(); // Add one default search line
  }

  request() {
    this.loading = true;
    this.error = '';

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

        // Scroll to results section after search is complete
        setTimeout(() => {
          this.scrollToResults();
        });
      },
      error => {
        console.error('Search error:', error);
        this.error = 'An error occurred while searching. Please try again.';
        this.loading = false;
      }
    );
  }

  // New method to scroll to results
  scrollToResults() {
    if (this.resultsSection) {
      this.resultsSection.nativeElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }
}
/*@Component({
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

  submit() {
    console.log('Submitting search:', this.searchlines);

    const queryParams = this.searchlines.map(line => ({
      column: line.column,
      operator: line.operator,
      value: line.value,
    }));

    this.apiService.queryDatabase({ filters: queryParams }).subscribe({
      next: (data) => {
        console.log('Résultats reçus:', data);
        this.results = data;
      },
      error: (error) => {
        console.error('Erreur lors de la requête:', error);
        this.results = [];
      },
    });
  }

}*/
