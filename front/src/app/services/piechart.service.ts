import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {of, shareReplay, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PiechartService {
  private apiUrl = 'http://api.lliger.fr';
  private cache = new Map<string, any>();
  constructor(private http: HttpClient) {}

  getData(route: string) {
    const cacheKey = `${this.apiUrl}/${route}`;
    if (this.cache.has(cacheKey)) {
      console.log('Données récupérées du cache local');
      return of(this.cache.get(cacheKey));
    }else
      return this.http.get(cacheKey).pipe(
        tap(data => this.cache.set(cacheKey, data)),
        shareReplay(1)
      );

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
