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
  isModalOpen = false;
  selectedKpi: { name: string; value: number; info: string } | null = null;

  result: SingleData = [];

  kpiData = [
    { name: 'KPI 1', value: 40, info: 'Informations supplémentaires sur KPI 1' },
    { name: 'KPI 2', value: 90, info: 'Informations supplémentaires sur KPI 2' },
    { name: 'KPI 3', value: 50, info: 'Informations supplémentaires sur KPI 3' },
    { name: 'KPI 4', value: 100, info: 'Informations supplémentaires sur KPI 4' },
    { name: 'KPI 5', value: 75, info: 'Informations supplémentaires sur KPI 5' },
    { name: 'KPI 6', value: 60, info: 'Informations supplémentaires sur KPI 6' },
    { name: 'KPI 7', value: 85, info: 'Informations supplémentaires sur KPI 7' },
    { name: 'KPI 8', value: 55, info: 'Informations supplémentaires sur KPI 8' },
  ];

  constructor(private readonly graphService: GraphService) {}

  ngOnInit() {
    this.printResult();
  }

  private printResult() {
    this.result = this.kpiData;
  }

  onKpiSelect(kpi: { name: string }) {
    const selected = this.kpiData.find((item) => item.name === kpi.name);
    if (selected) {
      this.selectedKpi = selected;
      this.isModalOpen = true;
    }
  }

  closeKpiModal() {
    this.isModalOpen = false;
    this.selectedKpi = null;
  }
}
