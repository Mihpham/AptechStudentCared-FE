import { Component, OnInit, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() averageRatesDay: { [className: string]: { [subject: string]: { day: string; lateRate: number }[] } } = {};
  @Input() selectedClass: string = '';
  @Input() selectedSubject: string = '';
  private svg: any;
  private width = 800;
  private height = 400;
  private margin = { top: 20, right: 30, bottom: 40, left: 40 };

  private xScale: any;
  private yScale: any;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.createSvg();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedClass && this.selectedSubject && this.averageRatesDay) {
      if (!this.svg) {  // If SVG is not created yet, create it
        this.createSvg();
      }
      this.updateChart();
    }
  }

  private createSvg(): void {
    const container = this.el.nativeElement.querySelector('.line-chart-container');
    if (container) {
      this.svg = d3
        .select(container)
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    } else {
      console.error('Container for line chart not found');
    }
  }

  private updateChart(): void {
    if (!this.selectedClass || !this.selectedSubject) return;

    const subjectData = this.averageRatesDay[this.selectedClass]?.[this.selectedSubject] || [];

    if (subjectData.length === 0) return;

    const data = subjectData.map((d) => ({
      date: d.day,
      lateRate: d.lateRate
    }));

    this.xScale = d3.scaleBand()
      .domain(data.map((d) => d.date))
      .range([0, this.width - this.margin.left - this.margin.right])
      .padding(0.1);

    this.yScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.lateRate) || 0])
      .range([this.height - this.margin.top - this.margin.bottom, 0]);

    // Clear the previous chart before adding new elements
    this.svg.selectAll('*').remove();

    // Append the X axis
    this.svg.append('g')
      .attr('transform', `translate(0,${this.height - this.margin.top - this.margin.bottom})`)
      .call(d3.axisBottom(this.xScale));

    // Append the Y axis
    this.svg.append('g')
      .call(d3.axisLeft(this.yScale));

    // Create the line
    const line = d3.line<{ date: string; lateRate: number }>()
      .x((d) => this.xScale(d.date) + this.xScale.bandwidth() / 2)
      .y((d) => this.yScale(d.lateRate));

    // Append the line path to the chart
    this.svg.append('path')
      .data([data])
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);
  }
}
