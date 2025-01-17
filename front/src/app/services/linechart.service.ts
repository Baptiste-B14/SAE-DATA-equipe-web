import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LinechartService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getData(route : string){
    return this.http.get(`${this.apiUrl}/${route}`);
  }

  formatData(rawData: any, route: string): any[] {
    const {data, years} = rawData;
    switch (route){
      case 'pub_in_time': {
        return [
          {
            name: 'Publications',
            series: rawData.map((item: any) => ({
              name: item.annee, // La clé "name" correspond aux années
              value: parseInt(item.nb_publications, 10)
            }))
          }
        ];
      }
      case 'collab_in_time':{
        return [
          {
            name: 'Collaborations',
            series: rawData.map((item: any) => ({
              name: item.annee, // La clé "name" correspond aux années
              value: parseInt(item.nb_collaborations, 10)
            }))
          }
        ];
      }
      default: {
        return [
          {
            name: 'Publications',
            series: rawData.map((item: any) => ({
              name: item.annee, // La clé "name" correspond aux années
              value: parseInt(item.nb_publications, 10)
            }))
          }
        ];
      }
    }
  }

}
