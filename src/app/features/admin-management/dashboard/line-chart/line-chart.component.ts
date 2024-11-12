import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  public categories = [
    { name: 'Chuyên cần', data: { DiscussionsNeeded: 12, DiscussionsDone: 10 } },
    { name: 'DSE', data: { DiscussionsNeeded: 15, DiscussionsDone: 10 } },
    { name: 'BTVN', data: { DiscussionsNeeded: 5, DiscussionsDone: 5 } },
    { name: 'Thi lại học lại', data: { DiscussionsNeeded: 7, DiscussionsDone: 5 } },
    { name: 'Giao tiếp và trao đổi', data: { DiscussionsNeeded: 11, DiscussionsDone: 9 } }
  ];

  private margin = { top: 20, right: 30, bottom: 50, left: 50 };
  private width = 1150 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;
  private svg: any;
  private tooltip: any;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.createSvg();
    this.createTooltip();
    this.drawLineChart();
  }

  private createSvg(): void {
    const element = this.el.nativeElement.querySelector('#line-chart-container');
    this.svg = d3.select(element)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  }

  private createTooltip(): void {
    const element = this.el.nativeElement.querySelector('#line-chart-container');
    this.tooltip = d3.select(element).append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', '1px solid #d3d3d3')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none'); // To prevent flickering
  }

  private drawLineChart(): void {
    const totalData = this.categories.map((category) => ({
      name: category.name,
      TotalNeeded: category.data.DiscussionsNeeded,
      TotalDone: category.data.DiscussionsDone
    }));

    const x = d3.scalePoint()
      .domain(totalData.map(d => d.name))
      .range([0, this.width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(totalData, d => Math.max(d.TotalNeeded, d.TotalDone))!])
      .nice()
      .range([this.height, 0]);

    this.svg.append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(0, 10)");

    this.svg.append('g')
      .call(d3.axisLeft(y));

    const lineNeeded = d3.line<any>()
      .x(d => x(d.name)!)
      .y(d => y(d.TotalNeeded));

    this.svg.append('path')
      .datum(totalData)
      .attr('fill', 'none')
      .attr('stroke', '#fecaca')
      .attr('stroke-width', 2)
      .attr('d', lineNeeded);

    const lineDone = d3.line<any>()
      .x(d => x(d.name)!)
      .y(d => y(d.TotalDone));

    this.svg.append('path')
      .datum(totalData)
      .attr('fill', 'none')
      .attr('stroke', '#bbf7d0')
      .attr('stroke-width', 2)
      .attr('d', lineDone);

    this.svg.selectAll("dotNeeded")
      .data(totalData)
      .enter()
      .append("circle")
      .attr("cx", (d: { name: string; }) => x(d.name)!)
      .attr("cy", (d: { TotalNeeded: d3.NumberValue; }) => y(d.TotalNeeded))
      .attr("r", 5)
      .attr("fill", "#fecaca")
      .on("mouseover", (event: MouseEvent, d: any) => {
        const isSamePoint = d.TotalNeeded === d.TotalDone;
        const tooltipContent = isSamePoint
          ? `<strong>${d.name}</strong><br>Total Needed: ${d.TotalNeeded}<br>Total Done: ${d.TotalDone}`
          : `<strong>${d.name}</strong><br>Total Needed: ${d.TotalNeeded}`;

        this.tooltip
          .style('opacity', 1)
          .html(tooltipContent)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on("mouseout", () => this.tooltip.style('opacity', 0));

    this.svg.selectAll("dotDone")
      .data(totalData)
      .enter()
      .append("circle")
      .attr("cx", (d: { name: string; }) => x(d.name)!)
      .attr("cy", (d: { TotalDone: d3.NumberValue; }) => y(d.TotalDone))
      .attr("r", 5)
      .attr("fill", "#bbf7d0")
      .on("mouseover", (event: MouseEvent, d: any) => {
        const isSamePoint = d.TotalNeeded === d.TotalDone;
        const tooltipContent = isSamePoint
          ? `<strong>${d.name}</strong><br>Total Needed: ${d.TotalNeeded}<br>Total Done: ${d.TotalDone}`
          : `<strong>${d.name}</strong><br>Total Done: ${d.TotalDone}`;

        this.tooltip
          .style('opacity', 1)
          .html(tooltipContent)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on("mouseout", () => this.tooltip.style('opacity', 0));
  }
}
