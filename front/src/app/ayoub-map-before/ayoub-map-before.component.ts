import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ayoub-map-before',
  standalone: true,
  imports: [],
  templateUrl: './ayoub-map-before.component.html',
  styleUrl: './ayoub-map-before.component.scss'
})
export class AyoubMapBeforeComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.http.get('assets/worldmap_3_yrs_before.html', { responseType: 'text' }).subscribe(
      (response) => {
        // Désactiver le zoom avant d'injecter le HTML
        const modifiedHtml = this.disableZoom(response);
        this.injectHtml(modifiedHtml);
      },
      (error) => {
        console.error('Failed to load HTML:', error);
      }
    );
  }

  private disableZoom(htmlContent: string): string {
    // Ajouter une option pour désactiver le zoom dans la configuration Folium
    return htmlContent.replace(
      'scrollWheelZoom: true',
      'scrollWheelZoom: false, dragging: false, touchZoom: false, doubleClickZoom: false, boxZoom: false'
    );
  }

  private injectHtml(htmlContent: string) {
    const container = this.el.nativeElement.querySelector('#dynamic-content-before');
    if (container) {
      container.innerHTML = htmlContent;

      // Extraire et exécuter les scripts
      const scripts = container.querySelectorAll('script');
      scripts.forEach((oldScript: HTMLScriptElement) => {
        const newScript = this.renderer.createElement('script');
        newScript.type = oldScript.type ? oldScript.type : 'text/javascript';
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.text = oldScript.text;
        }
        this.renderer.appendChild(container, newScript);
      });
    }
  }
}
