import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getCollaboration(route : string){
    return this.http.get(`${this.apiUrl}/${route}`);
  }

}
