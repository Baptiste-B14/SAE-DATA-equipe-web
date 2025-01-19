import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of, shareReplay, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LinechartService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getData(route : string){
    console.log(`${this.apiUrl}/${route}`)
    return this.http.get(`${this.apiUrl}/${route}`)
  }

  formatData(rawData: any, route: string): any[] {
    switch (route){
      case 'pub_in_time': {
        return [
          {
            name: 'Publications',
            series: rawData.message.map((item: any) => ({
              name: item.annee.toString(),
              value: parseInt(item.nb_publications, 10)
            }))
          }
        ];
      }
      case 'collab_in_time':{
        return [
          {
            name: 'Collaborations',
            series: rawData.message.map((item: any) => ({
              name: item.annee.toString(),
              value: parseInt(item.nb_collaborations, 10)
            }))
          }
        ];
      }
      default: {
        return [
          {
            name: 'Publications',
            series: rawData.message.map((item: any) => ({
              name: item.annee,
              value: parseInt(item.nb_publications, 10)
            }))
          }
        ];
      }
    }
  }

}
