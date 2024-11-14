import { Component, OnInit, ElementRef, AfterViewInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
}) 
export class BarChartComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() averageRates: { [className: string]: { [subject: string]: any } } = {};
  @Input() selectedClass: string = '';
  
  private margin = { top: 20, right: 30, bottom: 40, left: 50 };
  private width = 1200;
  private height = 400;
  private colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
  private rates = ["lateRate", "absenceRate", "disciplineRate", "competencyRate", "lateSubmissionRate", "noSubmissionRate"];
  
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createGroupedBarChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedClass'] && !changes['selectedClass'].firstChange) {
      this.createGroupedBarChart();
    }
  }

  private createGroupedBarChart(): void {
    const container = d3.select(this.elementRef.nativeElement).select('.bar-chart-container');
    container.selectAll('*').remove(); // Clear previous chart
  
    if (!this.averageRates[this.selectedClass]) return;
  
    const svg = container.append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  
    const selectedData = this.averageRates[this.selectedClass];
    const subjects = Object.keys(selectedData).slice(1); // Exclude the first subject
  
    const x = d3.scaleBand()
      .domain(subjects)
      .range([this.margin.left, this.width - this.margin.right])
      .padding(0.1);
  
    const y = d3.scaleLinear()
      .domain([
        0,
        d3.max(subjects.map((subject) => d3.max(this.rates.map((rate) => selectedData[subject][rate])))) || 100,
      ])
      .range([this.height - this.margin.bottom, this.margin.top]);
  
    svg.append('g')
      .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
      .call(d3.axisBottom(x));
  
    svg.append('g')
      .attr('transform', `translate(${this.margin.left},0)`)
      .call(d3.axisLeft(y));
  
    this.rates.forEach((rate, i) => {
      svg.selectAll(`.bar-${rate}`)
        .data(subjects)
        .enter()
        .append('rect')
        .attr('class', `bar-${rate}`)
        .attr('x', (d) => x(d) as number + (i * x.bandwidth()) / this.rates.length)
        .attr('y', (d) => y(selectedData[d][rate]))
        .attr('width', x.bandwidth() / this.rates.length)
        .attr('height', (d) => y(0) - y(selectedData[d][rate]))
        .attr('fill', this.colors[i]);
  
      // Add the percentage text on top of each bar
      svg.selectAll(`.text-${rate}`)
        .data(subjects)
        .enter()
        .append('text')
        .attr('class', `text-${rate}`)
        .attr('x', (d) => x(d) as number + (i * x.bandwidth()) / this.rates.length + x.bandwidth() / (2 * this.rates.length))
        .attr('y', (d) => y(selectedData[d][rate]) - 5) // Position the text slightly above the bar
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#000')
        .text((d) => {
          const rateValue = selectedData[d][rate];
          // Display only the integer part before the decimal
          return rateValue != null ? `${Math.floor(rateValue)}%` : '0%'; // Display integer part of percentage or 0%
        });
    });
  
    // Add a legend
    const legend = svg.append('g')
      .attr('transform', `translate(${this.width - 150}, ${this.margin.top})`);
  
    this.rates.forEach((rate, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);
  
      legendRow.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', this.colors[i]);
  
      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .attr('text-anchor', 'start')
        .style('font-size', '12px')
        .text(rate);
    });
  }
  
}
