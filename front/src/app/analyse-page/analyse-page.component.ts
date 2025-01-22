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
      title: "Publication",
      intro: "Intro texte explicatif pour l'Axe Publication",
    },
    {
      id: 2,
      title: "Collaboration",
      intro: "Intro texte explicatif pour l'Axe Collaboration",
    },
    {
      id: 3,
      title: "Affiliation",
      intro: "Intro texte explicatif pour l'Axe Affiliation",
    },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.axisId = +params['id']; // Convertit en entier
      this.axisData = this.axes.find(axis => axis.id === this.axisId);
    });
  }

  goToAxis(id: number) {
    this.router.navigate(['/analyses', this.axisId + id]);
  }
}
