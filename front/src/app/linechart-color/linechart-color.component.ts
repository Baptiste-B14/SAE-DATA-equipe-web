import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { LinechartService} from "../services/linechart.service";

@Component({
  selector: 'app-linechart-color',
  standalone: true,
  imports: [],
  templateUrl: './linechart-color.component.html',
  styleUrl: './linechart-color.component.scss'
})

export class LineChartComponent implements OnInit {
  chartData: any[] = [];
  @Input() route!: string;
  @Input() XLegend!: string;
  @Input() YLegend! : string;

  constructor(private el: ElementRef, private linechartService: LinechartService) {}
  ngOnInit(): void {
    this.linechartService.getData(this.route).subscribe(
      (data) => {
        const formattedData = this.linechartService.formatData(data, this.route);
        console.log('Données formatées pour le graphique :', formattedData);

        this.chartData = formattedData;
        this.createChart();
      },
      (error) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }


  private createChart() {
    const element = this.el.nativeElement.querySelector('.chart-container');

    const width = element.offsetWidth || 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 40; // Augmenté pour l'espace de la légende droite
    const marginBottom = 60; // Augmenté pour l'espace de la légende X
    const marginLeft = 70; // Augmenté pour l'espace de la légende Y

    const parseDate = d3.utcParse('%Y');
    const parsedData = this.chartData.flatMap(d =>
      d.series.map((item: any) => ({
        date: parseDate(item.name),
        nb_collaborations: item.value,
        annee: item.name,
        periode: item.periode
      }))
    ).filter(d => d.date !== null);

    const periods = Array.from(new Set(parsedData.map(d => d.periode)));
    const connectedData = periods.flatMap((periode, index) => {
      const currentPeriodData = parsedData.filter(d => d.periode === periode);

      if (index < periods.length - 1) {
        const nextPeriod = periods[index + 1];
        const nextPeriodData = parsedData.filter(d => d.periode === nextPeriod);

        if (currentPeriodData.length > 0 && nextPeriodData.length > 0) {
          const lastPoint = currentPeriodData[currentPeriodData.length - 1];
          const firstPointNext = nextPeriodData[0];

          return [
            ...currentPeriodData,
            {
              ...lastPoint,
              periode: nextPeriod,
            }
          ];
        }
      }
      return currentPeriodData;
    });

    const x = d3.scaleUtc()
      .domain(d3.extent(connectedData, d => d.date) as [Date, Date])
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(connectedData, d => d.nb_collaborations) as number]).nice()
      .range([height - marginBottom, marginTop]);

    const color = d3.scaleOrdinal<string, string>()
      .domain([...new Set(connectedData.map(d => d.periode))])
      .range(['#1f77b4', '#fb8c21', '#23af23', '#ea2526']);

    const line = d3.line<{ date: Date; nb_collaborations: number }>()
      .x(d => x(d.date))
      .y(d => y(d.nb_collaborations))
      .curve(d3.curveLinear);

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .style('max-width', '100%')
      .style('height', 'auto');

    // Grille horizontale
    svg.append('g')
      .attr('class', 'grid grid-y')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(
        d3.axisLeft(y)
          .ticks(5)
          .tickSize(-(width - marginLeft - marginRight))
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-dasharray', '4,2'); // Style pointillé

    // Grille verticale
    svg.append('g')
      .attr('class', 'grid grid-x')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .call(
        d3.axisBottom(x)
          .ticks(10) // Nombre de lignes verticales
          .tickSize(-(height - marginTop - marginBottom)) // Longueur des lignes
          .tickFormat(() => '') // Pas de texte
      )
      .selectAll('line')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-dasharray', '4,2'); // Style pointillé

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .call(
        d3.axisBottom(x)
          .ticks(d3.utcYear.every(2))
          .tickSizeOuter(0)
      )
      .selectAll('text')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-45)')
      .style('font-size', '10px');

    svg.append('g')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y));

    // Légende X
    svg.append('text')
      .attr('x', (width - marginLeft - marginRight) / 2 + marginLeft)
      .attr('y', height - marginBottom + 40) // Plus éloigné de l'axe
      .style('text-anchor', 'middle')
      .style('font-size', '14px') // Taille de police augmentée
      .text(this.XLegend)


    // Légende Y
    svg.append('text')
      .attr('x', -(height - marginTop - marginBottom) / 2 - marginTop)
      .attr('y', marginLeft - 50) // Plus éloigné de l'axe
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'middle')
      .style('font-size', '14px') // Taille de police augmentée
      .text(this.YLegend)
      .attr('y', 10);

    const groupedData = d3.group(connectedData, d => d.periode);

    groupedData.forEach((values, key) => {
      svg.append('path')
        .datum(values)
        .attr('fill', 'none')
        .attr('stroke', color(key as string))
        .attr('stroke-width', 2)
        .attr('d', line);
    });

    const legend = svg.append('g')
      .attr('transform', `translate(${width - marginRight - 120},${marginTop})`); // Position ajustée

    [...color.domain()].forEach((d, i) => {
      legend.append('rect')
        .attr('x', 0)
        .attr('y', i * 25) // Espacement augmenté
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', color(d));

      legend.append('text')
        .attr('x', 20)
        .attr('y', i * 25 + 12) // Espacement augmenté
        .text(d)
        .style('font-size', '12px')
        .attr('alignment-baseline', 'middle');
    });
  }

}
