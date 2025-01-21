import { Component } from '@angular/core';
import { BarChartModule} from "@swimlane/ngx-charts";
import { SingleData} from "../../../types";
import { GraphService} from "../../../graph.service";
import { WordCloudComponent} from "../../../word-cloud/word-cloud.component";
import {WordChartComponent} from "../../../word-chart/word-chart.component";
import {ForceGraphComponent} from "../../../graph/graph.component";

@Component({
  selector: 'app-axe2',
  standalone: true,
    imports: [BarChartModule,
        WordCloudComponent,
        WordChartComponent, ForceGraphComponent
    ],
  templateUrl: './axe2.component.html',
  styleUrl: './axe2.component.scss'
})
export class Axe2Component {
  result: SingleData = [];
  view: [number, number] = [1200, 500];
  xAxisLabel = "Motifs d'insatisfaction";
  yAxisLabel = 'Nombre de passagers';

  constructor(private readonly graphService: GraphService) {}

  ngOnInit(){
    //this.result = this.format();
  }

  private format() {
    //return this.graphService.toSingleData()
  }


}
