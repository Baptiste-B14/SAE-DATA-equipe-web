import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of, shareReplay, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LinechartService {
  private apiUrl = 'http://localhost:5001';

  constructor(private http: HttpClient) {}

  getData(route: string) {
    console.log(`${this.apiUrl}/${route}`);
    return this.http.get(`${this.apiUrl}/${route}`);
  }

  formatData(rawData: any, route: string): any[] {
    if (!rawData || !rawData.message) {
      console.error('Données invalides reçues:', rawData);
      return [];
    }

    try {
      const data = rawData.message;
      switch (route) {
        case 'pub_in_time': {
          return [{
            name: 'Publications',
            series: data.map((item: any) => ({
              name: item.annee.toString(),
              value: parseInt(item.nb_publications, 10),
              periode: item.periode
            }))
          }];
        }
        case 'collab_in_time': {
          return [{
            name: 'Collaborations',
            series: data.map((item: any) => ({
              name: item.annee.toString(),
              value: parseInt(item.nb_collaborations, 10),
              periode: item.periode
            }))
          }];
        }
        case 'page_in_time': {
          return [{
            name: 'Pages',
            series: data.map((item: any) => ({
              name: item.annee.toString(),
              value: parseFloat(item.moy_longueur_pages),
              periode: item.periode
            }))
          }];
        }
        default: {
          console.error('Route non gérée:', route);
          return [];
        }
      }
    } catch (error) {
      console.error('Erreur lors du formatage des données:', error);
      return [];
    }
  }
}
