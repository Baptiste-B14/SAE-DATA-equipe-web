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

  periodslist = {
    "avant": 'avant',
    "pendant": 'pendant',
    "apres": 'apres',
  };

  selectedPeriod: string = this.periodslist['avant'];
  @Input() period: string = this.selectedPeriod;

  @ViewChild('mapContainer', { read: ViewContainerRef }) container: ViewContainerRef | undefined;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}


  ngAfterViewInit() {
    this.updateComponent()
  }
  onPeriodChange(): void {
    this.period = this.selectedPeriod;
    this.updateComponent(); // Recharger le composant correspondant
  }

  private updateComponent() {
    if (!this.container) {
      console.error("Container is undefined");
      return;
    }

    this.container.clear();

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
      ref.changeDetectorRef.detectChanges();
    }
  }

  protected readonly Object = Object;
}
