import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

export interface SearchFilter {
    column: string;
    operator: string;
    value: any;
  }
  
  @Injectable({
    providedIn: 'root'
  })
  export class SearchService {
    private apiUrl = 'http://localhost:5000'; // Update this to match your Flask server URL
  
    // Add available tables property
    readonly availableTables: string[] = [
      'Publication',
      // Add other tables here if needed
    ];
  
    constructor(private http: HttpClient) {}
  
    search(filters: SearchFilter[]): Observable<any[]> {
      return this.http.post<any[]>(`${this.apiUrl}/search`, { filters })
        .pipe(
          catchError(error => {
            console.error('Search error:', error);
            throw error;
          })
        );
    }
  
    // Optional: Get available columns from the database
    getTableColumns(tableName: string = 'Publication'): Observable<string[]> {
      return this.http.get<string[]>(`${this.apiUrl}/columns/${tableName}`);
    }
  
    // Optional: Get available tables from the database
    getTables(): Observable<string[]> {
      return this.http.get<string[]>(`${this.apiUrl}/tables`);
    }
  }