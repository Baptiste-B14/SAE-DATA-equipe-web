import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AncreComponent } from './ancre/ancre.component';
import { filter } from 'rxjs/operators';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, RouterLink, AncreComponent, NgxChartsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title ='front';


  /*Tout ce qui suit est utilisé pour faire un défilement auto sur certains element d'une page*/

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Écouter les événements de navigation pour le changement de fragment
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Vérifier s'il y a un fragment dans l'URL
      const fragment = this.route.snapshot.fragment;
      if (fragment) {
        this.scrollToAnchor(fragment);
      }
    });
  }

  // Fonction pour faire défiler jusqu'à l'élément avec l'ID du fragment
  private scrollToAnchor(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      // Défilement fluide vers l'élément cible
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
