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
    { name: 'Publications', value: 7578943, info: 'nous avons du faire face à 7 millions de données' },
    { name: 'Chercheurs', value: 4591275, info: 'qu\'ils soit auteurs ou éditeurs, il existe 4 millions de chercheurs inscrit dans la base' },
    { name: 'Collaborations', value: 48308363, info: 'Informations supplémentaires sur KPI 5' },
    { name: 'Villes', value: 16155, info: 'Informations supplémentaires sur KPI 3' },
    { name: 'Editeurs uniquement', value: 2230, info: 'Informations supplémentaires sur KPI 4' },
    { name: 'Universités', value: 94072, info: 'Informations supplémentaires sur KPI 6' },
    { name: 'Personnes par publication en moyenne', value: 7.5, info: 'Informations supplémentaires sur KPI 7' },
    { name: 'Publications par auteur en moyenne', value: 5.5, info: 'Informations supplémentaires sur KPI 8' },
  ];

  constructor(private readonly graphService: GraphService) {}

  ngOnInit() {
    this.printResult();
  }

  truncateText(name: any) {
    return name.label
  }

  formatValue(data: any){
    return data.value.toLocaleString('fr-FR'); // Utilise le format français (séparateur des milliers = espace)
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
  stopPropagation(event: Event) {
    event.stopPropagation();
  }


  closeKpiModal() {
    this.isModalOpen = false;
    this.selectedKpi = null;
  }

  
}
