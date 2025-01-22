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
    { name: 'Publications', value: 7578943, info: 'Nous avons dû faire face à plus de 7 millions de publications enregistrées dans DBLP' },
    { name: 'Chercheurs', value: 4591275, info: 'Qu\'ils soient auteurs ou éditeurs, il existe 4 millions de chercheurs différents ayant contribué aux publications' },
    { name: 'Collaborations', value: 48308363, info: 'Une collaboration étant définie comme une association de deux personnes à un moment donné, plus de 48 millions de collaborations ont été enregistrées' },
    { name: 'Catégories de publication', value: 9, info: 'Il existe 9 catégories de publication, à savoir : les articles, inproceedings, proceedings, incollection, data, book, mastersthesis et phdthesis' },
    { name: 'Personnes par publication en moyenne', value: 7, info: 'La recherche collaborative étant très fréquente, une publication est en moyenne réalisée par 7 personnes' },
    { name: 'Publications par auteur en moyenne', value: 5, info: 'Avec 5 publications par auteur en moyenne, le domaine de la recherche s\'inscrit comme un milieu très actif' },
    { name: 'Pages par publication en moyenne', value: 9, info: 'En dehors de la production élevée de publications, celles-ci sont également conséquentes avec 9 pages en moyenne' },
    { name: 'Années de suivi', value: 88, info: 'Les données récoltées s\'étendent de 1936 à 2024, facilitant grandement le suivi temporel des activités des chercheurs' },

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
