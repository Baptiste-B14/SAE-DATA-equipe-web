import { Component, OnInit, AfterViewInit } from '@angular/core';
import {BubbleChartModule} from "@swimlane/ngx-charts";
import * as L from 'leaflet';


@Component({
  selector: 'app-bubble-chart',
  standalone: true,
  imports: [
    BubbleChartModule
  ],
  templateUrl: './bubble-chart-custom.component.html',
  styleUrl: './bubble-chart-custom.component.scss'
})

export class BubbleChartCustomComponent implements AfterViewInit{
  private map: L.Map | undefined;

  private locations =[
      {city: "Kabul", lat:34, lng:69, population: 8419600},
      {city: "Tirana", lat:41, lng:19, population: 8419600},
      {city: "Algiers", lat:36, lng:3, population: 8419600},
      {city: "Andorra la Vella", lat:42, lng:1, population: 8419600}
    ]
      /*[
    { lat: 35.91516, lng:69, population: 8419600 },
    { lat: 34.0522, lng: -118.2437, population: 3980400 },
    { lat: 41.8781, lng: -87.6298, population: 2716000 }
  ];*/



    ngAfterViewInit(): void {
    this.initMap();
    this.addCircles();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 4
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private addCircles(): void {
    this.locations.forEach((location) => {
      L.circle([location.lat, location.lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: location.population / 100
      }).addTo(this.map!);
    });
  }






}
