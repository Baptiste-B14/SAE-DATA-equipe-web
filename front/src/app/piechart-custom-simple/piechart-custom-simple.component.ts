import {Component, Input} from '@angular/core';
import {PieChartModule} from "@swimlane/ngx-charts";
import {PiechartService} from "../services/piechart.service";

/*
  - version basique et fonctionnelle d'un pie chart (sans limit, prériode, etc...)
*/

@Component({
  selector: 'app-piechart-custom-simple',
  standalone: true,
  imports: [PieChartModule],
  templateUrl: './piechart-custom-simple.component.html',
  styleUrl: './piechart-custom-simple.component.scss'
})
export class PiechartCustomSimpleComponent {
  constructor(private piechartService: PiechartService) {}
  @Input() route!: string;
  view : [number, number] = [600, 400];
  chartData: any[] = [];

  ngOnInit(): void {
    this.piechartService.getDataSimple(this.route,).subscribe((data) => {
      this.chartData = this.piechartService.formatData(data, this.route, 0, 'null');
    },
      (error)=> {
      console.log('Erreur lors de la récupération  des données :', error);
      });
  }

}
