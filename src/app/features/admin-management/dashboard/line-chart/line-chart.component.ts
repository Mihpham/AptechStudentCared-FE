import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  private data = [
    { category: 'Đi muộn', DiscussionsNeeded: 12, DiscussionsDone: 10 },
    { category: 'Nghỉ', DiscussionsNeeded: 15, DiscussionsDone: 10 },
    { category: 'Ý thức', DiscussionsNeeded: 1, DiscussionsDone: 1 },
    { category: 'Năng lực', DiscussionsNeeded: 1, DiscussionsDone: 1 },
    { category: 'Nộp muộn', DiscussionsNeeded: 5, DiscussionsDone: 5 },
    { category: 'Không nộp', DiscussionsNeeded: 6, DiscussionsDone: 5 },
    { category: 'Thi lại', DiscussionsNeeded: 2, DiscussionsDone: 5 },
    { category: 'Học lại', DiscussionsNeeded: 5, DiscussionsDone: 6 },
    { category: 'Phụ huynh', DiscussionsNeeded: 11, DiscussionsDone: 9 },
    { category: 'AH', DiscussionsNeeded: 7, DiscussionsDone: 7 }
  ];

  private svg: any;
  private tooltip: any;
  private margin = 50;
  private width = 1150 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.createSvg();
    this.createTooltip();
    this.drawLineChart(this.data);

    // Add event listener for window resize
    window.addEventListener('resize', () => this.resizeChart());
  }

  private createSvg(): void {
    const element = this.el.nativeElement.querySelector('figure#chart');
    const boundingWidth = element.clientWidth;

    this.width = boundingWidth - (this.margin * 2);

    d3.select(element).select('svg').remove();  // Clear existing SVG for resizing

    this.svg = d3.select(element)
      .append('svg')
      .attr('width', boundingWidth)
      .attr('height', this.height + (this.margin * 2) + 30)  // Extra space for text
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private createTooltip(): void {
    this.tooltip = d3.select("figure#chart")
      .append("div")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #d3d3d3")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("opacity", 0);
  }

  private drawLineChart(data: { category: string, DiscussionsNeeded: number, DiscussionsDone: number }[]): void {
    const x = d3.scalePoint()
      .domain(data.map(d => d.category))
      .range([0, this.width]);
  
    this.svg.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.DiscussionsNeeded, d.DiscussionsDone))!])
      .range([this.height, 0]);
  
    this.svg.append('g')
      .call(d3.axisLeft(y));
  
    const lineNeed = d3.line<{ category: string, DiscussionsNeeded: number, DiscussionsDone: number }>()
      .x(d => x(d.category)!)
      .y(d => y(d.DiscussionsNeeded));
  
    const lineDone = d3.line<{ category: string, DiscussionsNeeded: number, DiscussionsDone: number }>()
      .x(d => x(d.category)!)
      .y(d => y(d.DiscussionsDone));
  
    // Apply the corresponding colors for bg-red-100 and bg-green-100
    const red100 = '#fecaca'; 
    const green100 = '#bbf7d0'; 
  
    this.svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', red100)
      .attr('stroke-width', 2)
      .attr('d', lineNeed);
  
    this.svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', green100)
      .attr('stroke-width', 2)
      .attr('d', lineDone);
  
    this.svg.selectAll('dot-DiscussionsNeeded')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d: { category: string; }) => x(d.category)!)
      .attr('cy', (d: { DiscussionsNeeded: d3.NumberValue; }) => y(d.DiscussionsNeeded))
      .attr('r', 5)
      .attr('fill', red100)
      .on("mouseover", (event: any, d: any) => this.showTooltip(event, d, 'DiscussionsNeeded'))
      .on("mouseout", () => this.hideTooltip());
  
    this.svg.selectAll('dot-DiscussionsDone')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d: { category: string; }) => x(d.category)!)
      .attr('cy', (d: { DiscussionsDone: d3.NumberValue; }) => y(d.DiscussionsDone))
      .attr('r', 5)
      .attr('fill', green100)
      .on("mouseover", (event: any, d: any) => this.showTooltip(event, d, 'DiscussionsDone'))
      .on("mouseout", () => this.hideTooltip());
  
    this.drawLegend();
  }
  

  private showTooltip(event: any, d: any, type: string): void {
    let text = `<strong>${d.category}</strong><br>`;
    if (d.DiscussionsNeeded === d.DiscussionsDone) {
      text += `Need: ${d.DiscussionsNeeded}<br>Done: ${d.DiscussionsDone}`;
    } else {
      text += type === 'DiscussionsNeeded' ? `Need: ${d.DiscussionsNeeded}` : `Done: ${d.DiscussionsDone}`;
    }

    this.tooltip
      .style("opacity", 1)
      .html(text)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 10) + "px");
  }

  private hideTooltip(): void {
    this.tooltip.style("opacity", 0);
  }

  private drawLegend(): void {

    const red200 = '#fecaca'; 
    const green200 = '#bbf7d0'; 
  
    const legend = this.svg.append("g")
      .attr("transform", `translate(${this.width - 80}, -30)`);

    legend.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 20)
      .attr("y2", 0)
      .attr("stroke", red200)
      .attr("stroke-width", 2);

    legend.append("text")
      .attr("x", 30)
      .attr("y", 5)
      .text("Need")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");

    legend.append("line")
      .attr("x1", 0)
      .attr("y1", 20)
      .attr("x2", 20)
      .attr("y2", 20)
      .attr("stroke", green200)
      .attr("stroke-width", 2);

    legend.append("text")
      .attr("x", 30)
      .attr("y", 25)
      .text("Done")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
  }

  private resizeChart(): void {
    this.createSvg();
    this.drawLineChart(this.data);
  }
}
