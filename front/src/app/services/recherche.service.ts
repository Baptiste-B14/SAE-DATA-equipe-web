import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';


export interface SearchFilter {
  column: string;
  operator: string;
  value: any;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://api.lliger.fr:5432';

  constructor(private http: HttpClient) {}

  search(filters: SearchFilter[], table: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/search`, { 
      filters,
      table
    }).pipe(
      catchError(error => {
        console.error('Search error:', error);
        return throwError(() => error);
      })
    );
  }

  getTableColumns(tableName: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/columns/${tableName}`);
  }

  getTables(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/tables`);
  }
}