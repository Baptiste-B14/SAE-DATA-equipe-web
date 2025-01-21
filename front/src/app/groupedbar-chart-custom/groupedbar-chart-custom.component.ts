import {BarChartModule, LineChartModule} from "@swimlane/ngx-charts";
import { Component, Input } from '@angular/core';
import { GroupedbarService} from "../services/groupedbar.service";

@Component({
  selector: 'app-groupedbar-chart-custom',
  standalone: true,
  imports: [
    BarChartModule,
    LineChartModule
  ],
  templateUrl: './groupedbar-chart-custom.component.html',
  styleUrl: './groupedbar-chart-custom.component.scss'
})
export class GroupedbarChartCustomComponent {

  constructor(private groupedbarService: GroupedbarService) {}
  chartData: any[] = [];
  @Input() route!: string;
  view : [number, number] = [1000, 400]


  ngOnInit(): void {

    this.groupedbarService.getData(this.route).subscribe(
      (data) => {
        this.chartData = this.groupedbarService.formatData(data, this.route);
        console.log('Données formatées pour le graphique :', this.chartData);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );

  }

}
