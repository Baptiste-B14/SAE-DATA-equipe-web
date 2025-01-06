import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-analyse-page',
  standalone: true,
  imports: [],
  templateUrl: './analyse-page.component.html',
  styleUrl: './analyse-page.component.scss'
})
export class AnalysePageComponent {
  axisId: number = 1;
  axisData: any;
  
  axes = [
    {
      id: 1,
      title: "Titre de l'Axe 1",
      intro: "Intro texte explicatif pour l'Axe 1",
      content: [
        {
          image: 'assets/images/gsp2_png.PNG',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit pour Axe 1.'
        },
        {
          image: 'assets/images/gsp3_png.PNG',
          text: 'Curabitur sit amet mauris nec lectus pharetra facilisis pour Axe 1.'
        },
      ],
      conclusion: "Conclusion de l'Axe 1"
    },
    {
      id: 2,
      title: "Titre de l'Axe 2",
      intro: "Intro texte explicatif pour l'Axe 2",
      content: [
        {
          image: 'assets/images/gsp_png.PNG',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit pour Axe 2.'
        },
        {
          image: 'assets/images/gsp2_png.PNG',
          text: 'Curabitur sit amet mauris nec lectus pharetra facilisis pour Axe 2.'
        },
      ],
      conclusion: "Conclusion de l'Axe 2"
    },
    {
      id: 3,
      title: "Titre de l'Axe 3",
      intro: "Intro texte explicatif pour l'Axe 3",
      content: [
        {
          image: 'assets/images/gsp3_png.PNG',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit pour Axe 3.'
        },
        {
          image: 'assets/images/gsp2_png.PNG',
          text: 'Curabitur sit amet mauris nec lectus pharetra facilisis pour Axe 3.'
        },
      ],
      conclusion: "Conclusion de l'Axe 3"
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
    this.router.navigate(['/analyses', id]);
  }
}
