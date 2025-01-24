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
              value: parseInt(item.nb_publications, 10),
              periode: item.periode
            }))
          }
        ];
      }
      case 'collab_in_time': {
        return [
          {
            name: 'Collaborations',
            series: rawData.message.map((item: any) => ({
              name: item.annee.toString(),
              value: parseInt(item.nb_collaborations, 10),
              periode: item.periode
            }))
          }
        ];
      }
      case 'categ_in_time': {
        const categoryGroups:any = {};

        rawData.message.forEach((item: any) => {
          if (!categoryGroups[item.category]) {
            categoryGroups[item.category] = [];
          }

          categoryGroups[item.category].push({
            name: item.year.toString(),
            value: parseInt(item.nb_publications, 10),
            periode: item.period
          });
        });


        return Object.keys(categoryGroups).map(category => ({
          name: category,
          series: categoryGroups[category]
        }));
      }
      case 'collab_local_internatio': {

        const categoryGroups:any = {};

        rawData.message.forEach((item: any) => {
          if (!categoryGroups[item.collab_type]) {
            categoryGroups[item.collab_type] = [];
          }

          categoryGroups[item.collab_type].push({
            name: item.publication_year.toString(),
            value: parseInt(item.collab_count, 10),
            periode: item.period
          });
        });

        // Convert to multi-series format
        return Object.keys(categoryGroups).map(collab_type => ({
          name: collab_type,
          series: categoryGroups[collab_type]
        }));
      }
      case 'page_in_time': {
        console.log([
          {
            name: 'Page',
            series: rawData.message.map((item: any) => ({
              name: item.annee.toString(),
              value: item.moy_longueur_pages,
            }))
          }
        ])
          return [
            {
              name: 'Page',
              series: rawData.message.map((item: any) => ({
                name: item.annee.toString(),
                value: item.moy_longueur_pages,
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
