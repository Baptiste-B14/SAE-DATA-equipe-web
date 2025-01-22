import { Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { WordcloudService } from "../services/wordcloud.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-word-cloud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './word-cloud.component.html',
  styleUrls: ['./word-cloud.component.scss']
})
export class WordCloudComponent implements OnInit {
  @ViewChild('wordCloudContainer', { static: true }) wordCloudContainer!: ElementRef;

  years: number[] = [];
  selectedYear: number = 2020; 
  words: { text: string; size: number }[] = [];
  startYear = 1937;
  endYear = 2024;

  constructor(
    private wordCloudService: WordcloudService,
    private cdr: ChangeDetectorRef
  ) {}

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
    const selectedYear = +(event.target as HTMLInputElement).value;
    this.selectedYear = selectedYear;
    this.fetchData(selectedYear);
  }

  fetchData(year: number): void {
    this.wordCloudService.getWordcloudData(year).subscribe({
      next: (data) => {
        if (Object.keys(data).length > 0) {
          this.createWordCloud(data);
        } else {
          console.warn('No data received for year:', year);
        }
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  private createWordCloud(wordsData: { [key: string]: number }): void {
    if (!this.wordCloudContainer) {
      console.error('Container not ready!');
      return;
    }

    const element = this.wordCloudContainer.nativeElement;
    element.innerHTML = '';

    const width = element.offsetWidth || 800;
    const height = element.offsetHeight || 450;

    const values = Object.values(wordsData);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    const scale = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([14, 80]); 

    this.words = Object.entries(wordsData)
      .map(([word, value]) => ({
        text: word,
        size: scale(value)
      }))
      .sort((a, b) => b.size - a.size) 
      .slice(0, 100); 

    const layout = cloud()
      .size([width, height])
      .words(this.words)
      .padding(5)
      .rotate(() => 0) 
      .fontSize(d => d.size!)
      .spiral('archimedean') 
      .on('end', words => this.draw(words, width, height));

    layout.start();
  }

  private draw(words: any[], width: number, height: number): void {
    const svg = d3.select(this.wordCloudContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height].join(' '));

    const group = svg.append('g')
      .attr('transform', `translate(${width/2},${height/2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    group.selectAll('text')
      .data(words)
      .join('text')
      .style('font-size', d => `${d.size}px`)
      .style('font-family', 'Arial')
      .style('fill', (_, i) => color(i.toString()))
      .attr('text-anchor', 'middle')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .text(d => d.text);

    this.cdr.detectChanges();
  }
}
