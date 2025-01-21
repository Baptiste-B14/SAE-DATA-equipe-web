import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getCollaboration(route : string){
    return this.http.get(`${this.apiUrl}/${route}`);
  }

  getWordcloudData(year: number): Observable<{ [key: string]: number }> {
    const yearString = ""+ year;
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/${yearString}`);
  }
}
