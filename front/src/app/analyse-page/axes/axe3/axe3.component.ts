import { Component } from '@angular/core';
import { ForceGraphComponent} from "../../../graph/graph.component";
import { AyoubMapDuringComponent } from '../../../ayoub-map-during/ayoub-map-during.component'; 
import { AyoubMapAfterComponent } from '../../../ayoub-map-after/ayoub-map-after.component';
import { AyoubMapBeforeComponent } from '../../../ayoub-map-before/ayoub-map-before.component';


@Component({
  selector: 'app-axe3',
  standalone: true,
  imports: [ForceGraphComponent,AyoubMapDuringComponent, AyoubMapAfterComponent,AyoubMapBeforeComponent],
  templateUrl: './axe3.component.html',
  styleUrl: './axe3.component.scss'
})
export class Axe3Component {

}
