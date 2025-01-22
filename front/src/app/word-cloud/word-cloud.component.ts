import {Component, ViewChild, ElementRef, Input, ChangeDetectorRef, OnInit} from '@angular/core';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { WordcloudService} from "../services/wordcloud.service";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-word-cloud',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './word-cloud.component.html',
  styleUrl: './word-cloud.component.scss'
})
export class WordCloudComponent {

  @ViewChild('wordCloudContainer', { static: false }) wordCloudContainer!: ElementRef;

  years: number[] = [];
  selectedYear: number = 2024;
  words : { text: string, size: number }[] | undefined
  constructor(private worldCloudService: WordcloudService, private cdr: ChangeDetectorRef) {}
  startYear = 1937;
  endYear = 2024;

  ngOnInit(): void {
    this.generateYears();
    this.fetchData(this.selectedYear);
  }

  generateYears(): void {
    for (let i = this.endYear; i >= this.startYear; i--) {
      this.years.push(i);
    }
  }

  onYearChange(event: Event): void {
    const selectedYear = +(event.target as HTMLSelectElement).value;
    this.fetchData(selectedYear);
  }

  fetchData(year: number): void {
    this.worldCloudService.getWordcloudData(year).subscribe(
      (data) => {
        this.createWordCloud(data);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  private createWordCloud(wordsData: { [key: string]: number }) {
    if (!this.wordCloudContainer) {
      console.error('Container not ready!');
      return;
    }

    const values = Object.values(wordsData);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const scale = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([20, 90]); // Plage de tailles des mots en pixels

    this.words = Object.keys(wordsData).map((word) => ({
      text: word,
      size: scale(wordsData[word]) // Taille normalisée
    }));

    this.cdr.detectChanges();

    const element = this.wordCloudContainer.nativeElement;
    element.innerHTML = '';

    const width = element.offsetWidth || 500; // Fallback size
    const height = element.offsetHeight || 500; // Fallback size

    const layout = cloud()
      .size([width, height])
      .words(this.words.map((d) => ({ text: d.text, size: d.size })))
      .padding(5)
      .rotate(0)
      .fontSize((d) => d.size!)
      .on('end', (words) => this.draw(words, width, height));

    layout.start();
  }

  private draw(words: any[], width: number, height: number) {
    const svg = d3.select(this.wordCloudContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const group = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Calculer une échelle de couleur en fonction de la distance
    const maxDistance = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
    const colorScale = d3.scaleLinear<string>()
      .domain([0, maxDistance])
      .range(['#ff0000', '#0000ff']); // Dégradé du rouge au bleu

    group.selectAll('text')
      .data(words)
      .enter()
      .append('text')
      .style('font-size', (d: any) => `${d.size}px`)
      .style('fill', (d: any) => {
        const distance = Math.sqrt(Math.pow(d.x, 2) + Math.pow(d.y, 2));
        return colorScale(distance);
      })
      .attr('text-anchor', 'middle')
      .attr('transform', (d: any) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
      .text((d: any) => d.text);
  }


}
