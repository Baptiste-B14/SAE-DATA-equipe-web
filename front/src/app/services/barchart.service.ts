import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of, shareReplay, tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BarchartService {
    private apiUrl = 'http://localhost:5000';

    constructor(private http: HttpClient) {}

    getData(route: string) {
      return this.http.get(`${this.apiUrl}/${route}`)
    }

    formatData(rawData: any, route: string): any[] {
        switch (route) {
          case 'collab_by_categ': {
            return rawData.message.map((item: any) => ({
                name: item.Categorie,
                value: parseInt(item.nb_collaborations, 10)
              }))
              .sort((a: { value: number; }, b: { value: number; }) => b.value - a.value);  // Trier par ordre décroissant
          }

          case 'first_collab': {

            return rawData.message.map((item: any) => ({
              name: item.periode,
              value: item.nb_premieres_collaborations,
            }))
          }


          default: {
            return [];
          }
        }
      }
}
