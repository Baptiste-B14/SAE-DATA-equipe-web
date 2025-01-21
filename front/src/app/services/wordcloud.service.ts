import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordcloudService {
  private apiUrl = 'http://localhost:5000/analyses/wordcloud';

  constructor(private http: HttpClient) {}

  getWordcloudData(year: number): Observable<{ [key: string]: number }> {
    const yearString = ""+ year;
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/${yearString}`);
  }

}
