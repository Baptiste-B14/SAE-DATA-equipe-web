import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {BarChartModule, LineChartModule} from "@swimlane/ngx-charts";
import { BubbleChartCustomComponent} from "../bubble-chart-custom/bubble-chart-custom.component";
import { Axe1Component} from "./axes/axe1/axe1.component";
import { Axe2Component} from "./axes/axe2/axe2.component";
import { Axe3Component} from "./axes/axe3/axe3.component";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-analyse-page',
  standalone: true,
  imports: [
    BarChartModule,
    LineChartModule,
    NgIf,
    BubbleChartCustomComponent,
    BarChartModule,
    Axe1Component,
    Axe3Component,
    Axe2Component
  ],
  templateUrl: './analyse-page.component.html',
  styleUrl: './analyse-page.component.scss'
})
export class AnalysePageComponent implements OnInit{
  axisId: number = 1;
  axisData: any;

  axes = [
    {
      id: 1,
      title: "Titre de l'Axe 1",
      intro: "Intro texte explicatif pour l'Axe 1",
    },
    {
      id: 2,
      title: "Titre de l'Axe 2",
      intro: "Intro texte explicatif pour l'Axe 2",
    },
    {
      id: 3,
      title: "Titre de l'Axe 3",
      intro: "Intro texte explicatif pour l'Axe 3",
    },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Récupérer l'ID de l'axe depuis l'URL
    this.route.params.subscribe(params => {
      this.axisId = +params['id']; // Convertit en entier
      this.axisData = this.axes.find(axis => axis.id === this.axisId);
    });
  }

  goToAxis(id: number) {
    console.log(this.axisId);
    this.router.navigate(['/analyses', this.axisId + id]);
  }
}
