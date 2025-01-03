import { Component } from '@angular/core';


@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.scss'
})
export class IndexPageComponent {
  axes = [
    {
      title: 'Axe 1',
      description: 'Explication sommaire de ce que l’Axe 1 présente',
      image: 'assets/images/gsp_png.PNG',
    },
    {
      title: 'Axe 2',
      description: 'Explication sommaire de ce que l’Axe 2 présente',
      image: 'assets/images/gsp_png.PNG',
    },
    {
      title: 'Axe 3',
      description: 'Explication sommaire de ce que l’Axe 3 présente',
      image: 'assets/images/gsp_png.PNG',
    },
  ];

  currentIndex = 0;

  // Naviguer à l'élément précédent ou suivant
  navigateCarousel(direction: 'prev' | 'next') {
    if (direction === 'prev') {
      this.currentIndex = (this.currentIndex === 0) ? this.axes.length - 1 : this.currentIndex - 1;
    } else if (direction === 'next') {
      this.currentIndex = (this.currentIndex === this.axes.length - 1) ? 0 : this.currentIndex + 1;
    }
  }

  // Naviguer directement à l'élément par son index
  navigateCarouselByIndex(index: number) {
    this.currentIndex = index;
  }
}