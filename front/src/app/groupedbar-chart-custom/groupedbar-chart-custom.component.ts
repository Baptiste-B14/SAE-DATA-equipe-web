import {BarChartModule} from "@swimlane/ngx-charts";
import { Component, Input } from '@angular/core';
import { GroupedbarService} from "../services/groupedbar.service";

@Component({
  selector: 'app-groupedbar-chart-custom',
  standalone: true,
  imports: [
    BarChartModule
  ],
  templateUrl: './groupedbar-chart-custom.component.html',
  styleUrl: './groupedbar-chart-custom.component.scss'
})
export class GroupedbarChartCustomComponent {

}


export class AreaChartCustomComponent {

  constructor(private groupedbarService: GroupedbarService) {}
  chartData: any[] = [];
  @Input() route!: string;


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
