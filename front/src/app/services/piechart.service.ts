import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {of, shareReplay, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PiechartService {
  private apiUrl = 'http://api.lliger.fr';
  private apiUrlLocal = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getData(route: string) {
    const cacheKey = `${this.apiUrl}/${route}`;
    console.log("route : " + cacheKey)

    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      console.log('Données récupérées de localStorage');
      const parsedData = JSON.parse(cachedData);
      return of(parsedData);
    }
    console.log('Données non trouvées dans le cache. Requête API en cours...');
    return this.http.get(cacheKey).pipe(
      tap((data) => {
        console.log('Données récupérées depuis l’API et stockées dans localStorage et la Map');
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }),
      shareReplay(1) // Assure que l'observable est partagé
    );
  }

  getDataSimple(route: string) {
    return this.http.get(`${this.apiUrlLocal}/${route}`);
  }

  formatData(rawData: any, route : string): any[] {
    console.log(route)
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
