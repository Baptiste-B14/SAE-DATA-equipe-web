import {Component, ElementRef, Input} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GraphService} from "../services/graph.service";
import {AyoubMapDuringComponent} from "../ayoub-map-during/ayoub-map-during.component";

@Component({
  selector: 'app-map-selector',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    AyoubMapDuringComponent
  ],
  templateUrl: './map-selector.component.html',
  styleUrl: './map-selector.component.scss'
})
export class MapSelectorComponent {

  periodslist = {
    "avant": 'avant',
    "pendant": 'pendant',
    "apres": 'apres',
  };
  selectedPeriod: string = this.periodslist['pendant'];
  @Input() period: string =this.selectedPeriod;
  routeArgs: string = '';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
  }

  private changeRoute(route: string, period: string): void {
    this.routeArgs = `${route}?period=${period}`;
  }

  onPeriodChange(): void {
    //this.changeRoute()
    this.period = this.selectedPeriod;
  }

  protected readonly Object = Object;
}
