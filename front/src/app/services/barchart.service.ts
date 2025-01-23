import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
              .sort((a: { value: number; }, b: { value: number; }) => b.value - a.value);
          }

          case 'first_collab': {

            return rawData.message.map((item: any) => ({
              name: item.periode,
              value: item.nb_premieres_collaborations,
            }))
          }
          case 'top_collab': {
            return rawData.message
              .filter((item: any) => item['a.person_name'] && !isNaN(parseInt(item['count'], 10)))
              .map((item: any) => ({
                name: item['a.person_name'],
                value: parseInt(item['count'], 10),
              }));

          }
          case 'univ_by_publi': {
            return rawData.message
              .map((item: any) => ({
                name: item.university,
                value: item.nb_publications,
                pays: item.pays,
                percent: item.percent_production
              }));

          }

          default: {
            return [];
          }
        }
      }
}
