import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit} from '@angular/core';
import { BarChartModule, PieChartModule } from "@swimlane/ngx-charts";
import { RouterLink } from "@angular/router";
import { BarchartService } from "../services/barchart.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-barchart-custom',
  standalone: true,
  imports: [BarChartModule, RouterLink, PieChartModule, ReactiveFormsModule, FormsModule],
  templateUrl: './barchart-custom.component.html',
  styleUrl: './barchart-custom.component.scss'
})
export class BarchartCustomComponent implements AfterViewInit{

  constructor(private barchartService: BarchartService,  private cdr: ChangeDetectorRef ) {}
  chartData: any[] = [];
  view: [number, number] = [800, 400];
  @Input() route!: string;
  @Input() XLegend!: string;
  @Input() YLegend!: string;
  @Input() period!: string;
  @Input() legendTitle!: string;
  @Input() color!: boolean;

  periods = {
    'before': "before",
    'during': "during",
    'after': "after"
  };

  routeArgs: string = "";
  selectedPeriod: string = this.periods['during'];

  countryColors: any[] = [];
  ngOnInit(): void {
    this.changeRoute(this.route, this.period);
    this.fetchData(this.selectedPeriod);

  }
  ngAfterViewInit() {
    if(this.color) {
      this.generateCountryColors();
    }
  }

  changeRoute(route: string, period: string): void {
    if (route != "first_collab"&& route != "univ_by_publi") {
      this.routeArgs = route + "?period=" + period;
    } else {
      this.routeArgs = route;
    }
  }

  onPeriodChange(): void {
    this.fetchData(this.selectedPeriod);
  }

  fetchData(period: string): void {
    this.changeRoute(this.route, period);
    this.barchartService.getData(this.routeArgs).subscribe(
      (data) => {
        this.chartData = this.barchartService.formatData(data, this.route);
        console.log('Formatted chart data:', this.chartData);

        if(this.color) {
          this.generateCountryColors();
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  generateCountryColors(): void {
    const uniqueCountries = [...new Set(this.chartData.map(item => item.pays))];
    console.log('Unique countries:', uniqueCountries);

    const colorPalette = [
      '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
      '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
    ];

    this.countryColors = uniqueCountries.map((country, index) => ({
      name: country,
      value: colorPalette[index % colorPalette.length]
    }));

    console.log('Generated colors:', this.countryColors);
    this.cdr.detectChanges();

  }

  protected readonly Object = Object;
}
