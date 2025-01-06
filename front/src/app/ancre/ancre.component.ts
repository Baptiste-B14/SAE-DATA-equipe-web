import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-ancre',
  standalone: true,
  imports: [],
  templateUrl: './ancre.component.html',
  styleUrl: './ancre.component.scss'
})
export class AncreComponent {

  isButtonVisible = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isButtonVisible = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
