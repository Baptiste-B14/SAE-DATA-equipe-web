import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CounterAnimationService {
  animate(start: number, end: number, duration: number, callback: (value: number) => void) {
    const startTime = performance.now();
    const change = end - start;

    const animateCount = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Fonction d'easing pour une animation plus naturelle
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      const currentValue = Math.round(start + change * easedProgress);
      callback(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }
}
