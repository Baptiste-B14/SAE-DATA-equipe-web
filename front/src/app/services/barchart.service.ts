import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BarchartService {
    private apiUrl = 'http://localhost:5000';

    constructor(private http: HttpClient) {}
  
    getData(route: string) {
        return this.http.get(`${this.apiUrl}/${route}`);
    }
  
    formatData(rawData: any, route: string): any[] {
        switch (route) {
          case 'collab_by_categ': {
            return rawData
              .map((item: any) => ({
                name: item.Categorie,  
                value: parseInt(item.nb_collaborations, 10)  
              }))
              .sort((a: { value: number; }, b: { value: number; }) => b.value - a.value);  // Trier par ordre décroissant
          }
          default: {
            return [];
          }
        }
      }
}
