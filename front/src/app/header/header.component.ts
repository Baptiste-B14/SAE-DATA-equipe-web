import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isHidden = false; // Masquer/afficher le header
  isDropdownOpen = false; // Ouvrir/fermer le menu déroulant
  private lastScroll = 0;

  @HostListener('window:scroll', [])
  onScroll(): void {
    const currentScroll = window.pageYOffset;

    //le header disparait en scrollant vers le bas si sup a 100
    if (currentScroll > this.lastScroll && currentScroll > 100) {
      this.isHidden = true; // Masquer le header
    } else {
      this.isHidden = false; // Afficher le header
    }

    this.lastScroll = currentScroll;
  }


    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }
}
