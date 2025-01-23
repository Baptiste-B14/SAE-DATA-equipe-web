import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { KPIComponent } from '../kpi/kpi.component';


@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, KPIComponent],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.scss'
})
export class IndexPageComponent {
  axes = [
    {
      title: 'Axe des Tendances Générales',
      description: 'Explication sommaire de ce que l’Axe 1 présente',
      image: 'assets/images/AxeTendances.png',
      route: '/analyses/1',
    },
    {
      title: 'Axe des Collaborations',
      description: 'Explication sommaire de ce que l’Axe 2 présente',
      image: 'assets/images/AxeCollaboration.png',
      route: '/analyses/2',
    },
  ];

  currentIndex = 0;

  ngOnInit() {
    this.scrollToTop();
  }

  // va a l'élément suivant ou précédent
  navigateCarousel(direction: 'prev' | 'next') {
    if (direction === 'prev') {
      this.currentIndex =
        this.currentIndex === 0 ? this.axes.length - 1 : this.currentIndex - 1;
    } else if (direction === 'next') {
      this.currentIndex =
        this.currentIndex === this.axes.length - 1 ? 0 : this.currentIndex + 1;
    }
  }

  // va directement à un element 
  navigateCarouselByIndex(index: number) {
    this.currentIndex = index;
  }

  // Retourne le style transform basé sur currentIndex
  getTransformStyle(): string {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}