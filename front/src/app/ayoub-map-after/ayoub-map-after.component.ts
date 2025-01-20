import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ayoub-map-after',
  standalone: true,
  imports: [],
  templateUrl: './ayoub-map-after.component.html',
  styleUrl: './ayoub-map-after.component.scss'
})
export class AyoubMapAfterComponent {
  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {
    // Charger le contenu HTML
    this.http.get('assets/worldmap_after.html', { responseType: 'text' }).subscribe(
      (response) => {
        this.injectHtml(response);
      },
      (error) => {
        console.error('Failed to load HTML:', error);
      }
    );
  }

  private injectHtml(htmlContent: string) {
    const container = this.el.nativeElement.querySelector('#dynamic-content-after');
    container.innerHTML = htmlContent;

    // Extraire et exécuter les scripts
    const scripts = container.querySelectorAll('script');
    scripts.forEach((oldScript: HTMLScriptElement) => {
      const newScript = this.renderer.createElement('script');
      newScript.type = oldScript.type ? oldScript.type : 'text/javascript';
      if (oldScript.src) {
        // Si le script a une source externe
        newScript.src = oldScript.src;
      } else {
        // Si le script est inline
        newScript.text = oldScript.text;
      }
      this.renderer.appendChild(container, newScript);
    });
  }
}
