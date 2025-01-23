import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  private apiUrl = 'http://api.lliger.fr';

  constructor(private http: HttpClient) {}

  getCollaboration(route : string){
    return this.http.get(`${this.apiUrl}/${route}`);
  }

}
