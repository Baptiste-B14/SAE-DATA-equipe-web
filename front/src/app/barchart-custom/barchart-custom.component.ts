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
    this.fetchData(this.selectedPeriod)
    if (this.color) {
      this.generateCountryColors();
    }
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
        console.log('Raw data from API:', data);

        // Formater les données pour utiliser 'pays' comme 'name'
        this.chartData = this.barchartService.formatData(data, this.route).map(item => ({
          name: item.pays,  // Utilisez 'pays' pour synchroniser avec les couleurs
          value: parseInt(item.value, 10) // Convertir la valeur en nombre si nécessaire
        }));

        console.log('Formatted chart data:', this.chartData);

        // Générer les couleurs basées sur les pays
        if (this.color) {
          this.generateCountryColors();
          console.log('Generated colors:', this.countryColors);
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

    // Mappez chaque pays à une couleur
    const countryColorMap = uniqueCountries.reduce((map, country, index) => {
      map[country] = colorPalette[index % colorPalette.length];
      return map;
    }, {} as Record<string, string>);

    console.log('Country to color mapping:', countryColorMap);

    // Assignez les couleurs aux noms (name)
    this.countryColors = this.chartData.map(item => ({
      name: item.name, // Gardez 'name' comme clé utilisée dans chartData
      value: countryColorMap[item.pays] // Utilisez la couleur basée sur 'pays'
    }));

    console.log('Generated colors:', this.countryColors);
    this.cdr.detectChanges();
  }


  protected readonly Object = Object;
}
