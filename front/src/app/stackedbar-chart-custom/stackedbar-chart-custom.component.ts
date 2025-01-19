import { Component } from '@angular/core';
import {BarChartModule} from "@swimlane/ngx-charts";

@Component({
  selector: 'app-stackedbar-chart-custom',
  standalone: true,
  imports: [
    BarChartModule
  ],
  templateUrl: './stackedbar-chart-custom.component.html',
  styleUrl: './stackedbar-chart-custom.component.scss'
})
export class StackedbarChartCustomComponent {

}
