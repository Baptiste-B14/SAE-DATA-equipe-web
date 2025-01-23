import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphService } from '../graph.service';
import { CounterAnimationService } from '../services/counter-animation.service';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr, 'fr');

interface KPI {
  name: string;
  value: number;
  displayValue?: number;
  info?: string;
}

@Component({
  selector: 'app-kpi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' }
  ]
})
export class KPIComponent implements OnInit {
  result: KPI[] = [];
  selectedKpi: KPI | null = null;
  isModalOpen = false;

  constructor(
    private graphService: GraphService,
    private counterAnimation: CounterAnimationService
  ) {}

  ngOnInit() {
    this.loadKPIs();
  }

  loadKPIs() {
    this.result = [
      { name: 'Publications', value: 7578943, displayValue: 0, info: 'Nombre total de publications scientifiques dans notre base de données.' },
      { name: 'Chercheurs', value: 4591275, displayValue: 0, info: 'Nombre total de chercheurs ayant contribué aux publications.' },
      { name: 'Universités', value: 94072, displayValue: 0, info: 'Nombre d\'universités et institutions impliquées dans les recherches.' },
      { name: 'Collaborations', value: 48308363, displayValue: 0, info: 'Nombre total de collaborations entre chercheurs.' },
      { name: 'Personnes par publication en moyenne', value: 7, displayValue: 0, info: 'Moyenne du nombre d\'auteurs par publication.' },
      { name: 'Publications par auteur en moyenne', value: 5, displayValue: 0, info: 'Moyenne du nombre de publications par auteur.' },
      { name: 'Pages par publication en moyenne', value: 9, displayValue: 0, info: 'Nombre moyen de pages par publication.' },
      { name: 'Années de suivi', value: 88, displayValue: 0, info: 'Période couverte par les données en années.' }
    ];

    // Lancer toutes les animations simultanément
    this.result.forEach(kpi => this.animateValue(kpi));
  }

  animateValue(kpi: KPI) {
    this.counterAnimation.animate(0, kpi.value, 1500, (value: number) => {
      kpi.displayValue = value;
    });
  }

  onKpiSelect(kpi: KPI) {
    this.selectedKpi = kpi;
    this.isModalOpen = true;
  }

  closeKpiModal() {
    this.isModalOpen = false;
    this.selectedKpi = null;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
