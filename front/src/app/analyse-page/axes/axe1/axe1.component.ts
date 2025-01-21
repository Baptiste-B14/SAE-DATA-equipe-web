import { Component } from '@angular/core';
import {BubbleChartCustomComponent} from "../../../bubble-chart-custom/bubble-chart-custom.component";
import { LinechartCustomComponent} from "../../../linechart-custom/linechart-custom.component";
import {PiechartCustomComponent} from "../../../piechart-custom/piechart-custom.component";
import { PiechartCustomSimpleComponent } from '../../../piechart-custom-simple/piechart-custom-simple.component';
import { BarchartCustomComponent } from '../../../barchart-custom/barchart-custom.component';
import {LineChartComponent} from "../../../linechart-color/linechart-color.component";
import {GroupedbarChartCustomComponent} from "../../../groupedbar-chart-custom/groupedbar-chart-custom.component";

@Component({
  selector: 'app-axe1',
  standalone: true,
  imports: [
    BubbleChartCustomComponent,
    LinechartCustomComponent,
    PiechartCustomComponent,
    BarchartCustomComponent,
    PiechartCustomSimpleComponent,
    LineChartComponent,
    GroupedbarChartCustomComponent,
  ],
  templateUrl: './axe1.component.html',
  styleUrl: './axe1.component.scss'
})
export class Axe1Component {

}
