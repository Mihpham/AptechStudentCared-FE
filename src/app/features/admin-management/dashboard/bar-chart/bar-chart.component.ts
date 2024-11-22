import {
  Component,
  OnInit,
  ElementRef,
  AfterViewInit,
  OnChanges,
  Input,
  SimpleChanges,
} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() averageRates: { [className: string]: { [subject: string]: any } } =
    {};
  @Input() selectedClass: string = '';

  private margin = { top: 20, right: 30, bottom: 40, left: 50 };
  private width = 1200;
  private height = 400;
  private colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
  ];
  private rates = [
    'lateRate',
    'absenceRate',
    'disciplineRate',
    'competencyRate',
    'lateSubmissionRate',
    'noSubmissionRate',
  ];

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
    const container = d3
      .select(this.elementRef.nativeElement)
      .select('.bar-chart-container');
    container.selectAll('*').remove(); // Clear previous chart

    if (!this.averageRates[this.selectedClass]) return;

    const svg = container
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const selectedData = this.averageRates[this.selectedClass];
    const subjects = Object.keys(selectedData); // Use all keys as subjects

    // X-axis
    const x = d3
      .scaleBand()
      .domain(subjects)
      .range([this.margin.left, this.width - this.margin.right])
      .padding(0.1);

    // Y-axis
    const yMax = d3.max(
      subjects.map((subject) =>
        d3.max(this.rates.map((rate) => selectedData[subject]?.[rate] || 0))
      )
    );
    const y = d3
      .scaleLinear()
      .domain([0, yMax ? yMax * 1.1 : 100]) // Add padding for better visuals
      .range([this.height - this.margin.bottom, this.margin.top]);

    // Add X-axis
    svg
      .append('g')
      .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end');

    // Add Y-axis
    svg
      .append('g')
      .attr('transform', `translate(${this.margin.left},0)`)
      .call(d3.axisLeft(y));

    // Create bars and labels for each rate
    this.rates.forEach((rate, i) => {
      svg
        .selectAll(`.bar-${rate}`)
        .data(subjects)
        .enter()
        .append('rect')
        .attr('class', `bar-${rate}`)
        .attr('x', (d) => x(d)! + (i * x.bandwidth()) / this.rates.length)
        .attr('y', (d) => y(selectedData[d]?.[rate] || 0))
        .attr('width', x.bandwidth() / this.rates.length - 2) // Slightly reduce width for better spacing
        .attr('height', (d) => {
          const value = selectedData[d]?.[rate] || 0;
          return value > 0 ? y(0) - y(value) : 0; // Show only non-zero bars
        })
        .attr('fill', this.colors[i])
        .style('display', (d) => (selectedData[d]?.[rate] > 0 ? null : 'none')); // Hide bars with zero values

      // Add percentage text
      svg
        .selectAll(`.text-${rate}`)
        .data(subjects)
        .enter()
        .append('text')
        .attr('class', `text-${rate}`)
        .attr(
          'x',
          (d) =>
            x(d)! +
            (i * x.bandwidth()) / this.rates.length +
            x.bandwidth() / (2 * this.rates.length)
        )
        .attr('y', (d) =>
          Math.min(
            y(selectedData[d]?.[rate] || 0) - 5,
            this.height - this.margin.bottom - 10
          )
        )
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#000')
        .text((d) => {
          const rateValue = selectedData[d]?.[rate];
          return rateValue != null ? `${Math.floor(rateValue)}%` : '0%';
        });
    });

    // Add legend below the chart
    const legend = svg
      .append('g')
      .attr(
        'transform',
        `translate(${this.margin.left}, ${
          this.height - this.margin.bottom + 20
        })`
      ); // Đặt legend bên dưới biểu đồ

    this.rates.forEach((rate, i) => {
      const legendRow = legend
        .append('g')
        .attr('transform', `translate(${i * 150}, 0)`); // Mỗi chú thích cách nhau 150px

      legendRow
        .append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', this.colors[i]);

      legendRow
        .append('text')
        .attr('x', 20)
        .attr('y', 12)
        .style('font-size', '12px')
        .style('fill', '#333')
        .text(rate.replace(/([A-Z])/g, ' $1').trim()); // Format camelCase thành chữ có khoảng cách
    });
  }
}
