import { Component } from '@angular/core';

@Component({
  selector: 'app-presentation-page',
  standalone: true,
  imports: [],
  templateUrl: './presentation-page.component.html',
  styleUrl: './presentation-page.component.scss'
})
export class PresentationPageComponent {

  ngOnInit() {
    this.scrollToTop();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
