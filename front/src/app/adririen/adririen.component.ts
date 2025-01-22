import { Component } from '@angular/core';

@Component({
  selector: 'app-adririen',
  standalone: true,
  imports: [],
  templateUrl: './adririen.component.html',
  styleUrl: './adririen.component.scss'
})
export class AdririenComponent {
  ngOnInit() {
    let audio = document.getElementById('audio_adririen')
    console.log(audio)
  }
}
