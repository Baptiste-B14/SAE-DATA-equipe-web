import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  private apiUrl = 'http://localhost:5000/neo4j';

  constructor(private http: HttpClient) {}

  getCollaboration(){
    return this.http.get(this.apiUrl);
  }

  getWordcloudData(year: number): Observable<{ [key: string]: number }> {
    const yearString = ""+ year;
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/${yearString}`);
  }
}
