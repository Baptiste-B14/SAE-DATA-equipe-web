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



  view : [number, number] = [600, 400];
  chartData: any[] = [];
  @Input() route!: string;
  @Input() limit!: number;
  @Input() period! : string;
  selectedPeriod : string = this.periods['before'];

  ngOnInit(): void {
    this.piechartService.getData(this.route, this.limit, this.period).subscribe((data) => {
      this.chartData = this.piechartService.formatData(data, this.route, this.limit, this.period);
    },
      (error)=> {
      console.log('Erreur lors de la récupération  des données :', error);
      });
  }

  onPeriodChange(event: Event): void {
    const selectedPeriod = +(event.target as HTMLSelectElement).value;
    this.fetchData(this.selectedPeriod);
  }

  fetchData(period: string): void {
    this.piechartService.getData(this.route, this.limit, this.period).subscribe((data) => {
        this.chartData = this.piechartService.formatData(data, this.route, this.limit, this.period);
      },
      (error)=> {
        console.log('Erreur lors de la récupération  des données :', error);
      }
    );
  }

  protected readonly Object = Object;
}
