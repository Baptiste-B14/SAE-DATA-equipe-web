import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { GraphService } from '../services/graph.service';
import { PieChartModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [
    PieChartModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class ForceGraphComponent implements OnInit {

  periodslist = {
    "avant": 'avant',
    "pendant": 'pendant',
    "apres": 'apres',
  };
  nodeslist = {
    "avant": 'avant',
    "pendant": 'pendant',
    "apres": 'apres',
  };

  selectedPeriod: string = this.periodslist['pendant'];
  selectedNodes: string = this.nodeslist['pendant'];
  @Input() route!: string;
  @Input() period: string =this.selectedPeriod;
  @Input() node: string = this.selectedNodes;




  routeArgs: string = '';
  svg: any;

  constructor(private el: ElementRef, private graphService: GraphService) {}

  ngOnInit(): void {
    this.updateGraph();
  }

  private changeRoute(route: string, node: string, period: string): void {
    this.routeArgs = `${route}?nodes=${node}&period=${period}`;
  }

  onPeriodChange(): void {
    if (!this.getFilteredNodes().includes(this.selectedNodes)) {
      this.selectedNodes = this.getFilteredNodes()[0];
    }
    this.period = this.selectedPeriod;
    this.updateGraph();
  }

  onNodeChange(): void {

    if (!this.getFilteredPeriods().includes(this.selectedPeriod)) {
      this.selectedPeriod = this.getFilteredPeriods()[0];
    }
    this.node = this.selectedNodes;
    this.updateGraph();
  }



  getFilteredPeriods(): string[] {
    if (this.selectedNodes === 'apres') {
      return Object.keys(this.periodslist).filter(period => period !== 'avant');
    }
    return Object.keys(this.periodslist);
  }

  getFilteredNodes(): string[] {
    if (this.selectedPeriod === 'avant') {
      return Object.keys(this.nodeslist).filter(node => node !== 'apres');
    }
    return Object.keys(this.nodeslist);
  }

  private updateGraph(): void {
    this.changeRoute(this.route, this.node, this.period);

    if (this.svg) {
      this.svg.selectAll('*').remove();
    }

    this.graphService.getCollaboration(this.routeArgs).subscribe((data) => {
      this.createForceGraph(data);
    });
  }

  private createForceGraph(data: any): void {
    const element = this.el.nativeElement.querySelector('.graph-container');
    const width = 800;
    const height = 500;

    d3.select(element).select('svg').remove();

    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    const nodeDegrees = new Map();
    data.message.links.forEach((link: any) => {
      nodeDegrees.set(link.source, (nodeDegrees.get(link.source) || 0) + 1);
    });

    const sizeScale = d3
      .scaleLinear()
      .domain([0, d3.max([...nodeDegrees.values()]) || 1])
      .range([5, 20]);

    const simulation = d3
      .forceSimulation(data.message.nodes)
      .force(
        'link',
        d3
          .forceLink(data.message.links)
          .id((d: any) => {
            return d.id
          })
          .distance((link: any) => {
            const sourceWeight = nodeDegrees.get(link.source) || 1;
            const targetWeight = nodeDegrees.get(link.target) || 1;
            return 100 / Math.sqrt(sourceWeight + targetWeight);
          })
      )
      .force(
        'charge',
        d3.forceManyBody().strength((d: any) => {
          const weight = nodeDegrees.get(d.id) || 1;
          return -50 * Math.sqrt(weight);
        })
      )
      .force('center', d3.forceCenter(0, 0))
      .force('x', d3.forceX(0).strength((d: any) => {
        const weight = nodeDegrees.get(d.id) || 1;
        return 0.1 + weight * 0.01;
      }))
      .force('y', d3.forceY(0).strength((d: any) => {
        const weight = nodeDegrees.get(d.id) || 1;
        return 0.1 + weight * 0.01;
      }));



    const link = this.svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(data.message.links)
      .join('line')
      .attr('stroke-width', 2);

    const node = this.svg
      .append('g')
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(data.message.nodes)
      .join('circle')
      .attr('r', (d: any) => sizeScale(nodeDegrees.get(d.id) || 0))
      .attr('fill', (d: any) =>
        (nodeDegrees.get(d.id) || 0) === 0 ? 'red' : 'steelblue'
      )
      .call(this.drag(simulation));

    node.append('title').text(
      (d: any) => `${d.name} (${nodeDegrees.get(d.id) || 0} links)`
    );

    const padding = 7;
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) =>
          (d.x = Math.max(-width / 2 + padding, Math.min(width / 2 - padding, d.x)))
        )
        .attr('cy', (d: any) =>
          (d.y = Math.max(-height / 2 + padding, Math.min(height / 2 - padding, d.y)))
        );
    });


    node.on('mouseover', (event: any, d: any) => {
      const connectedNodes = new Set(
        data.message.links
          .filter((link: any) => link.source === d || link.target === d)
          .flatMap((link: any) => [link.source, link.target])
      );

      node
        .transition()
        .duration(200)
        .attr('r', (n: any) =>
          connectedNodes.has(n)
            ? sizeScale(nodeDegrees.get(n.id) || 0) * 1.5
            : sizeScale(nodeDegrees.get(n.id) || 0)
        )
        .attr('opacity', (n: any) => (connectedNodes.has(n) ? 1 : 0.3));

      link
        .transition()
        .duration(200)
        .attr('stroke-opacity', (l: any) =>
          l.source === d || l.target === d ? 1 : 0.2
        )
        .attr('stroke-width', (l: any) =>
          l.source === d || l.target === d ? 4 : 2
        );
    });

    node.on('mouseout', () => {
      node
        .transition()
        .duration(200)
        .attr('r', (d: any) => sizeScale(nodeDegrees.get(d.id) || 0))
        .attr('opacity', 1);

      link
        .transition()
        .duration(200)
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', 2);
    });

  }



  private drag(simulation: any): any {
    return d3
      .drag()
      .on('start', (event: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      })
      .on('drag', (event: any) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      })
      .on('end', (event: any) => {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      });
  }




  protected readonly Object = Object;
}
