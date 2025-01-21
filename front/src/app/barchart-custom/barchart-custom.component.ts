import {Component, ElementRef, Input} from '@angular/core';
import {BarChartModule} from "@swimlane/ngx-charts";
import {RouterLink} from "@angular/router";
import {BarchartService} from "../services/barchart.service";
import {catchError, map, Observable, of} from "rxjs";

@Component({
  selector: 'app-barchart-custom',
  standalone: true,
  imports: [BarChartModule, RouterLink],
  templateUrl: './barchart-custom.component.html',
  styleUrl: './barchart-custom.component.scss'
})
export class BarchartCustomComponent {

  constructor(private barchartService: BarchartService) {}
  chartData: any[] = [];
  view : [number, number] = [600, 400];
  @Input() route!: string;
  @Input() XLegend!: string;
  @Input() YLegend!: string;

  ngOnInit(): void {

    this.barchartService.getData(this.route).subscribe(
      (data) => {
        this.chartData = this.barchartService.formatData(data, this.route);
        console.log('Données formatées pour le graphique :', this.chartData);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );

  }

}
