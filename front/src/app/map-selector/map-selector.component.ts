import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  Input,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AyoubMapDuringComponent } from "../ayoub-map-during/ayoub-map-during.component";
import { AyoubMapAfterComponent } from "../ayoub-map-after/ayoub-map-after.component";
import { AyoubMapBeforeComponent } from "../ayoub-map-before/ayoub-map-before.component";

@Component({
  selector: 'app-map-selector',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    AyoubMapDuringComponent,
    AyoubMapAfterComponent,
    AyoubMapBeforeComponent
  ],
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.scss']
})
export class MapSelectorComponent implements AfterViewInit {
  // Liste des périodes
  periodslist = {
    "avant": 'avant',
    "pendant": 'pendant',
    "apres": 'apres',
  };

  selectedPeriod: string = this.periodslist['avant']; // Période par défaut
  @Input() period: string = this.selectedPeriod;

  // Conteneur pour charger dynamiquement les composants
  @ViewChild('mapContainer', { read: ViewContainerRef }) container: ViewContainerRef | undefined;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngAfterViewInit() {
    this.updateComponent(); // Charger le composant initial
  }

  // Méthode appelée lorsqu'on change la période
  onPeriodChange(): void {
    this.period = this.selectedPeriod;
    this.updateComponent(); // Recharger le composant correspondant
  }

  // Méthode pour mettre à jour le composant
  private updateComponent() {
    if (!this.container) {
      console.error("Container is undefined");
      return;
    }

    this.container.clear(); // Vider le conteneur avant de charger un nouveau composant

    let componentToLoad: any;
    if (this.selectedPeriod === this.periodslist['avant']) {
      componentToLoad = AyoubMapBeforeComponent;
    } else if (this.selectedPeriod === this.periodslist['pendant']) {
      componentToLoad = AyoubMapDuringComponent;
    } else if (this.selectedPeriod === this.periodslist['apres']) {
      componentToLoad = AyoubMapAfterComponent;
    }

    if (componentToLoad) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(componentToLoad);
      const ref = this.container.createComponent(factory);
      ref.changeDetectorRef.detectChanges(); // Appliquer les changements
    }
  }
}
