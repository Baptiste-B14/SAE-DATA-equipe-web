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

/*
    WordCloud(text, {
    size = group => group.length, // Given a grouping of words, returns the size factor for that word
    word = d => d, // Given an item of the data array, returns the word
    marginTop = 0, // top margin, in pixels
    marginRight = 0, // right margin, in pixels
    marginBottom = 0, // bottom margin, in pixels
    marginLeft = 0, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    maxWords = 250, // maximum number of words to extract from the text
    fontFamily = "sans-serif", // font family
    fontScale = 15, // base font size
    fill = null, // text color, can be a constant or a function of the word
    padding = 0, // amount of padding between the words (in pixels)
    rotate = 0, // a constant or function to rotate the words
    invalidation // when this promise resolves, stop the simulation
  } = {}) {
    const words = typeof text === "string" ? text.split(/\W+/g) : Array.from(text);

    const data = d3.rollups(words, size, w => w)
      .sort(([, a], [, b]) => d3.descending(a, b))
      .slice(0, maxWords)
      .map(([key, size]) => ({text: word(key), size}));

    const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("font-family", fontFamily)
      .attr("text-anchor", "middle")
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const g = svg.append("g").attr("transform", `translate(${marginLeft},${marginTop})`);

    const cloud = cloud()
      .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
      .words(data)
      .padding(padding)
      .rotate(rotate)
      .font(fontFamily)
      .fontSize(d => Math.sqrt(d.size) * fontScale)
      .on("word", ({size, x, y, rotate, text}) => {
        g.append("text")
          .datum(text)
          .attr("font-size", size)
          .attr("fill", fill)
          .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
          .text(text);
      });

    cloud.start();
    invalidation && invalidation.then(() => cloud.stop());
    return svg.node();
  }

  words = [
    { text: 'Angular', size: 40 },
    { text: 'D3.js', size: 30 },
    { text: 'TypeScript', size: 25 },
    { text: 'JavaScript', size: 20 },
    { text: 'SVG', size: 15 },
    { text: 'WordCloud', size: 50 },
  ];*/
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

    group.selectAll('text')
      .data(words)
      .enter()
      .append('text')
      .style('font-size', (d: any) => `${d.size}px`)
      .style('fill', () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
      .attr('text-anchor', 'middle')
      .attr('transform', (d: any) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
      .text((d: any) => d.text);
  }

}
