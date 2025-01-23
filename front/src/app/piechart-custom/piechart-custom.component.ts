import {Component, Input} from '@angular/core';
import {PieChartModule} from "@swimlane/ngx-charts";
import {PiechartService} from "../services/piechart.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-piechart-custom',
  standalone: true,
  imports: [PieChartModule, FormsModule],
  templateUrl: './piechart-custom.component.html',
  styleUrl: './piechart-custom.component.scss'
})
export class PiechartCustomComponent {
  constructor(private piechartService: PiechartService) {}

  periods   = {
    'before': "before",
    'during': "during",
    'after': "after"
    };

  view : [number, number] = [800, 400];
  chartData: any[] = [];
  @Input() route!: string;
  @Input() period! : string;
  @Input() option!: boolean;
  @Input() legendTitle!: string;

  routeArgs : string = "";
  selectedPeriod : string = this.periods['during'];



  ngOnInit(): void {
    this.changeRoute(this.route, this.period)
    this.piechartService.getData(this.routeArgs).subscribe((data) => {
      this.chartData = this.piechartService.formatData(data, this.route);
    },
      (error)=> {
      console.log('Erreur lors de la récupération  des données :', error);
      });
  }


  changeRoute(route : string, period: string){
    this.routeArgs = route +"?period=" + period
  }

  onPeriodChange(): void {
    this.fetchData(this.selectedPeriod);
  }

  fetchData(period: string): void {
    this.changeRoute(this.route, period )
    this.piechartService.getData(this.routeArgs).subscribe((data) => {
        this.chartData = this.piechartService.formatData(data, this.routeArgs);
      },
      (error)=> {
        console.log('Erreur lors de la récupération  des données :', error);
      }
    );
  }

  hoveredSlice: { name: string; option: number } | null = null;



  onSliceHover(slice: any): void {
    console.log('Hovered slice:', slice);
    console.log(slice.value.name)

        const sliceData = this.chartData.find(item => item.name === slice.name);
        if (sliceData) {
          this.hoveredSlice = { name: slice.name, option: sliceData.option };
        }
  }

  tooltipText = (data: any) => {
    console.log(data)
    return `${data.data.name} (${data.value}%)`;
  };







  protected readonly Object = Object;


}


