import { Component, Input, OnInit } from '@angular/core';
import { NumberCardModule } from '@swimlane/ngx-charts';
import { GraphService } from '../graph.service';
import { SingleData } from '../types';

@Component({
  selector: 'app-kpi',
  standalone: true,
  imports: [NumberCardModule],
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss'],
})
export class KPIComponent implements OnInit {
  cardColor = "white";
  colorScheme = "white";
    
  result: SingleData = [];

  kpiData = [
    { name: 'KPI 1', value: 40 },
    { name: 'KPI 2', value: 90 },
    { name: 'KPI 3', value: 50 },
    { name: 'KPI 4', value: 100 },
    { name: 'KPI 5', value: 75 },
    { name: 'KPI 6', value: 60 },
    { name: 'KPI 7', value: 85 },
    { name: 'KPI 8', value: 55 },
  ];

  constructor(private readonly graphService: GraphService) {}

  ngOnInit() {
    this.printResult();
  }

  private printResult() {
    this.result = this.kpiData;
  }
}
