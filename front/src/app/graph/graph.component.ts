import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import force from 'd3-force';


@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class ForceGraphComponent implements OnInit {
  //@Input() nodes: any[] = [];
  //@Input() links: any[] = [];

   nodes: CustomNodeDatum[] = [
    { id: "red", color: "red", size: 5 },
    { id: "orange", color: "orange", size: 10 },
    { id: "yellow", color: "yellow", size: 15 },
    { id: "green", color: "green", size: 20 },
    { id: "blue", color: "blue", size: 25 },
    { id: "purple", color: "purple", size: 30 }
  ];

  links = [
    { source: "red", target: "orange" },
    { source: "orange", target: "yellow" },
    { source: "yellow", target: "green" },
    { source: "green", target: "blue" },
    { source: "blue", target: "purple" },
    { source: "purple", target: "red" },
    { source: "green", target: "red" }
  ];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.createForceGraph();
  }

  private createForceGraph(): void {
    const element = this.el.nativeElement;

    // Paramètres par défaut
    const width = 640;
    const height = 400;

    const svg = d3.select(element)
      .select('.graph-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    const simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(0, 0));

    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll()
      .data(this.links)
      .join("line")
      .attr("stroke-width", 5);

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(this.nodes)
      .join('circle')
      .attr('r', d => d.size)
      .attr('fill', 'currentColor')
      .call(this.drag(simulation));

    node.append('title')
      .text((d: any) => d.id);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    });
  }

  private drag(simulation: any): any {
    return d3.drag()
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
}


interface CustomNodeDatum extends d3.SimulationNodeDatum {
  id: string;
  color: string;
  size: number;
}
