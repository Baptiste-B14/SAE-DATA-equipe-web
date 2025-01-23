import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of, shareReplay, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GroupedbarService {
  private apiUrl = 'http://api.lliger.fr';

  constructor(private http: HttpClient) {}

  getData(route : string){
    return this.http.get(`${this.apiUrl}/${route}`)
  }

  formatData(rawData: any, route: string): any[] {
    switch (route){
      case 'collab_seules_vs_collab': {
          return rawData.message.map((item: any) => ({
            name: item.annee.toString(), // La période devient le nom du groupe
            series: [
              {
                name: 'Publications Seules',
                value: parseInt(item.nb_publications_seules, 10) // Valeur des publications seules
              },
              {
                name: 'Publications Collaboratives',
                value: parseInt(item.nb_publications_collaboratives, 10) // Valeur des publications collaboratives
              }
            ]
          }));
        }
      case 'first_collab': {
        return rawData.message.map((item: any) => ({
          name: item.annee.toString(), // La période devient le nom du groupe
          series: [
            {
              name: 'Publications Seules',
              value: parseInt(item.nb_publications_seules, 10) // Valeur des publications seules
            },
            {
              name: 'Publications Collaboratives',
              value: parseInt(item.nb_publications_collaboratives, 10) // Valeur des publications collaboratives
            }
          ]
        }));
      }

      case 'univ_by_publi': {
        return rawData.message.map((item: any) => ({
            name: item.Pays,
            series: [
              {
                name: 'Avant',
                  value: parseInt(item.nb_publications_collaboratives, 10) // Valeur des publications collaboratives
              },
              {
                name: 'Pendant',
                value: parseInt(item.pendan, 10) // Valeur des publications collaboratives
              },
              {
                name: 'Après',
                value: parseInt(item.nb_publications_collaboratives, 10) // Valeur des publications collaboratives
              },
              ]
          }));

      }

      default: {
        return [
          {
            name: 'Publications',
            series: rawData.map((item: any) => ({
              name: item.annee,
              value: parseInt(item.nb_publications, 10)
            }))
          }
        ];
      }
    }
  }

}
