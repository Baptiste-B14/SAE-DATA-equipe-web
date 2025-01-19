import {Component, ElementRef, Input} from '@angular/core';
import {LineChartModule} from "@swimlane/ngx-charts";
import {RouterLink} from "@angular/router";
import {LinechartService} from "../services/linechart.service";

@Component({
  selector: 'app-linechart-custom',
  standalone: true,
  imports: [LineChartModule, RouterLink],
  templateUrl: './linechart-custom.component.html',
  styleUrl: './linechart-custom.component.scss'
})
export class LinechartCustomComponent {
  constructor(private linechartService: LinechartService) {}
  chartData: any[] = [];
  @Input() route!: string;


  ngOnInit(): void {

    this.linechartService.getData(this.route).subscribe(
      (data) => {
        this.chartData = this.linechartService.formatData(data, this.route);
        console.log('Données formatées pour le graphique :', this.chartData);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );

  }

}
