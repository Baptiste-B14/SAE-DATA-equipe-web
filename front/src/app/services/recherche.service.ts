import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError, shareReplay } from 'rxjs';

/**
 * Interface for search filter
 */
export interface SearchFilter {
  column: string;
  operator: string;
  value: any;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:5001';
  private columnsCache = new Map<string, Observable<string[]>>();

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
    // Check cache first
    if (this.columnsCache.has(tableName)) {
      return this.columnsCache.get(tableName)!;
    }

    // Create new request and cache it
    const request = this.http.get<any>(`${this.apiUrl}/columns/${tableName}`).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error);
        }
        return response.message;
      }),
      catchError(error => {
        console.error('Error loading columns:', error);
        // Remove failed request from cache
        this.columnsCache.delete(tableName);
        return throwError(() => error);
      }),
      // Cache the successful response
      shareReplay(1)
    );

    this.columnsCache.set(tableName, request);
    return request;
  }

  getTables(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/tables`);
  }
}