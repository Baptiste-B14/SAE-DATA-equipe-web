import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {of, shareReplay, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PiechartService {
  private apiUrlLocal = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getData(route: string) {
    return this.http.get(`${this.apiUrlLocal}/${route}`)
  }

  getDataSimple(route: string) {
    return this.http.get(`${this.apiUrlLocal}/${route}`);
  }

  formatData(rawData: any, route : string): any[] {
    switch (route) {
      case 'top_collab':{
        return rawData.message
          .filter((item: any) => item['a.person_name'] && !isNaN(parseInt(item['count'], 10)))
          .map((item: any) => ({
            name: item['a.person_name'],
            value: parseInt(item['count'], 10),
          }));
      }
      case 'collab_by_categ': {
        return rawData.message
          .map((item: any) => ({
            name: item.Categorie,
            value: parseInt(item.nb_collaborations, 10)
          }))
          .sort((a: { value: number; }, b: { value: number; }) => b.value - a.value);  // Trier par ordre décroissant
      }

      case 'author_by_country': {
        return rawData.message
          .map((item: any) => ({
            name: item.country,
            value: item.percent,
            option: item.nb_author

          }))
      }
      default:{
        return rawData.message
          .filter((item: any) => item['a.person_name'] && !isNaN(parseInt(item['count'], 10)))
          .map((item: any) => ({
            name: item['a.person_name'],
            value: parseInt(item['count'], 10),
          }));

      }
    }
  }

}
