import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordchartService {

  private apiUrl = 'http://api.lliger.fr/analyses/wordchart';

  constructor(private http: HttpClient) {}

  getWordchartData(words: string[]): Observable<any> {

    const params = { words };
    return this.http.get(this.apiUrl, { params });
  }
}
