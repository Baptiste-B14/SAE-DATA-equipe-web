import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PiechartService {
  private apiUrl = 'http://api.lliger.fr/';
  private apiUrlLocal = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getData(route: string, limit : number, period : string) {
    return this.http.get(this.apiUrl + `top_collab?period=${period}&limit=${limit}`);
  }

  getDataSimple(route: string) {
    return this.http.get(`${this.apiUrlLocal}/${route}`);
  }

  formatData(rawData: any, route : string, limit : number, period : string): any[] {

    switch (route) {
      case 'top_collab':{
        return rawData.message
          .filter((item: any) => item['a.person_name'] && !isNaN(parseInt(item['count'], 10)))
          .map((item: any) => ({
            name: item['a.person_name'],
            value: parseInt(item['count'], 10),
          }));
      }
      // route non retenue car pas assez visible en pie chart
      case 'collab_by_categ': {
        return rawData
          .map((item: any) => ({
            name: item.Categorie,  
            value: parseInt(item.nb_collaborations, 10)  
          }))
          .sort((a: { value: number; }, b: { value: number; }) => b.value - a.value);  // Trier par ordre décroissant
      }
      default:{
        console.log(rawData)
        console.log(route)
        const {data, years} = rawData;
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
