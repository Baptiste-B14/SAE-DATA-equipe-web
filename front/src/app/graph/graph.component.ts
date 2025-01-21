import {Component, OnInit, Input, ElementRef} from '@angular/core';
import * as d3 from 'd3';
import { GraphService} from "../services/graph.service";
import {PieChartModule} from "@swimlane/ngx-charts";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [
    PieChartModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class ForceGraphComponent implements OnInit {
  @Input() route! : string;
  @Input() period! : string;
  @Input() node! : string;

  periodslist = {
    'before' : "before",
    'during' : "during",
    'after' : "after",
  }
  nodeslist = {
    'before' : "before",
    'during' : "during",
    'after' : "after",
  }

  selectedPeriod : string = this.periodslist['during'];
  selectedNodes : string = this.nodeslist['during'];

  routeArgs : string = "";

  constructor(private el: ElementRef, private graphService: GraphService) {}

  ngOnInit(): void {
    this.changeRoute(this.route, this.node, this.period)
    this.graphService.getCollaboration(this.routeArgs).subscribe(data => this.createForceGraph(data))
  }

  private changeRoute(route : string, node : string, period: string){
    this.routeArgs = route +"?nodes=" + node + "&period=" + period
  }

  onPeriodChange(event: Event): void {
    const selectedPeriod = +(event.target as HTMLSelectElement).value;
  }

  onNodeChange(event: Event): void {
    const s = +(event.target as HTMLSelectElement).value;
  }

  private createForceGraph(data :any ): void {


    const element = this.el.nativeElement;
    const width = 800;
    const height = 500;

    const svg = d3.select(element)
      .select('.graph-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    const simulation = d3.forceSimulation(data.message.nodes)
      .force('link', d3.forceLink(data.message.links).id((d: any) => d.name))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(0, 0));

    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll()
      .data(data.message.links)
      .join("line")
      .attr("stroke-width", 5);


    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(data.message.nodes)
      .join('circle')
      .attr('r', 1)
      .attr('fill', 'currentColor')
      .call(this.drag(simulation))
      .on('mouseover', (event, d) => this.mouseover(d))
      .on('mouseout', () => this.mouseout());

    node.append('title')
      .text((d: any) => d.name);

    const padding = 20;

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x = Math.max(-width / 2 + padding, Math.min(width / 2 - padding, d.x)))
        .attr('cy', (d: any) => d.y = Math.max(-height / 2 + padding, Math.min(height / 2 - padding, d.y)));
    });

    const zoom = d3.zoom()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        svg.attr('transform', event.transform);
      });

  }




  private linkedByIndex: { [key: string]: boolean } = {};

// Vérifie si deux nœuds sont liés
  private neighboring(a: any, b: any): boolean {
    return a.index === b.index || this.linkedByIndex[`${a.index},${b.index}`];
  }

  private mouseover(d: any): void {
    d3.selectAll('circle').attr('r', 10);

    d3.selectAll('line')
      .style('stroke', 'black')
      .style('stroke-width', 4)
      .transition().duration(500)
      .style('opacity', (o: any) => (o.source === d || o.target === d ? 1 : 0.1));

    d3.selectAll('circle')
      .transition().duration(500)
      .style('opacity', (o: any) => (this.neighboring(d, o) ? 1 : 0.1));
  }

  private mouseout(): void {
    d3.selectAll('circle') .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .join('circle')
      .attr('r', 1)
      .attr('fill', 'currentColor')

    d3.selectAll('line')
      .style('stroke', 'grey')
      .style('stroke-width', 1)
      .transition().duration(500)
      .style('opacity', 1);

    d3.selectAll('circle').transition().duration(500).style('opacity', 1);
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

  protected readonly Object = Object;
}


interface CustomNodeDatum extends d3.SimulationNodeDatum {
  name: string;
  size: 1;

}
