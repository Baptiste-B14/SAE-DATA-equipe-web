import {Component, ElementRef, Input} from '@angular/core';
import {BarChartModule, PieChartModule} from "@swimlane/ngx-charts";
import {RouterLink} from "@angular/router";
import {BarchartService} from "../services/barchart.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-barchart-custom',
  standalone: true,
  imports: [BarChartModule, RouterLink, PieChartModule, ReactiveFormsModule, FormsModule],
  templateUrl: './barchart-custom.component.html',
  styleUrl: './barchart-custom.component.scss'
})
export class BarchartCustomComponent {

  constructor(private barchartService: BarchartService) {}
  chartData: any[] = [];
  view : [number, number] = [800, 400];
  @Input() route!: string;
  @Input() XLegend!: string;
  @Input() YLegend!: string;
  @Input() period!: string;
  @Input() legendTitle!: string;

  periods   = {
    'before': "before",
    'during': "during",
    'after': "after"
  };

  routeArgs : string = "";
  selectedPeriod : string = this.periods['during'];

  ngOnInit(): void {
    this.changeRoute(this.route, this.period)
    this.barchartService.getData(this.routeArgs).subscribe(
      (data) => {
        this.chartData = this.barchartService.formatData(data, this.route);
        console.log('Données formatées pour le graphique :', this.chartData);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );

  }

  changeRoute(route : string, period: string){

    if(route != "first_collab" && route != "author_by_country"){
      this.routeArgs = route +"?period=" + period
    }
    else this.routeArgs = route
  }

  onPeriodChange(): void {
    this.fetchData(this.selectedPeriod);
  }

  fetchData(period: string): void {
    this.changeRoute(this.route,  period)
    this.barchartService.getData(this.routeArgs).subscribe((data) => {
        this.chartData = this.barchartService.formatData(data, this.route);
      },
      (error)=> {
        console.log('Erreur lors de la récupération  des données :', error);
      }
    );
  }


  protected readonly Object = Object;
}
