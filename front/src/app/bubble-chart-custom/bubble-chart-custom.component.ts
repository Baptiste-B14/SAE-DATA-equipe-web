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

  private locations = [
    { lat: 40.7128, lng: -74.0060, population: 8419600 },
    { lat: 34.0522, lng: -118.2437, population: 3980400 },
    { lat: 41.8781, lng: -87.6298, population: 2716000 }
  ];

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
