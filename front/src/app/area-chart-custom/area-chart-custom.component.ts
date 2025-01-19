import { AreaChartModule } from "@swimlane/ngx-charts";
import { Component, Input } from '@angular/core';
import { AreaChartService } from "../services/area-chart.service";

@Component({
  selector: 'app-area-chart-custom',
  standalone: true,
  imports: [
    AreaChartModule
  ],
  templateUrl: './area-chart-custom.component.html',
  styleUrl: './area-chart-custom.component.scss'
})
export class AreaChartCustomComponent {

  constructor(private areaChartService: AreaChartService) {}
  chartData: any[] = [];
  @Input() route!: string;


  ngOnInit(): void {

    this.areaChartService.getData(this.route).subscribe(
      (data) => {
        this.chartData = this.areaChartService.formatData(data, this.route);
        console.log('Données formatées pour le graphique :', this.chartData);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );

  }

}
