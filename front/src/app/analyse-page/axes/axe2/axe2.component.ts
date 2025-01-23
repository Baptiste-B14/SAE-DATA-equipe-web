import { Component } from '@angular/core';
import { BarChartModule} from "@swimlane/ngx-charts";
import { SingleData} from "../../../types";
import { GraphService} from "../../../graph.service";
import { WordCloudComponent} from "../../../word-cloud/word-cloud.component";
import {WordChartComponent} from "../../../word-chart/word-chart.component";
import {ForceGraphComponent} from "../../../graph/graph.component";
import { LinechartCustomComponent} from "../../../linechart-custom/linechart-custom.component";
import {LineChartComponent} from "../../../linechart-color/linechart-color.component";
import {BarchartCustomComponent} from "../../../barchart-custom/barchart-custom.component";


@Component({
  selector: 'app-axe2',
  standalone: true,
  imports: [BarChartModule,
    WordCloudComponent,
    WordChartComponent, ForceGraphComponent,
    LinechartCustomComponent, LineChartComponent, BarchartCustomComponent
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
