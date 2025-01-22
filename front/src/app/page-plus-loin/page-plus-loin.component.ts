import { Component } from '@angular/core';
import {WordChartComponent} from "../word-chart/word-chart.component";
import {WordCloudComponent} from "../word-cloud/word-cloud.component";

@Component({
  selector: 'app-page-plus-loin',
  standalone: true,
    imports: [
        WordChartComponent,
        WordCloudComponent
    ],
  templateUrl: './page-plus-loin.component.html',
  styleUrl: './page-plus-loin.component.scss'
})
export class PagePlusLoinComponent {

}
