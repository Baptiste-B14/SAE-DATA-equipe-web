import { Component } from '@angular/core';
import {BubbleChartCustomComponent} from "../../../bubble-chart-custom/bubble-chart-custom.component";
import { LinechartCustomComponent} from "../../../linechart-custom/linechart-custom.component";
import {PiechartCustomComponent} from "../../../piechart-custom/piechart-custom.component";

@Component({
  selector: 'app-axe1',
  standalone: true,
  imports: [
    BubbleChartCustomComponent,
    LinechartCustomComponent,
    PiechartCustomComponent
  ],
  templateUrl: './axe1.component.html',
  styleUrl: './axe1.component.scss'
})
export class Axe1Component {

}
