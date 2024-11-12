import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';

interface CategoryData {
  category: string;
  needed: number;
  totalStudents: number; // Total number of students in each category
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {
  // Sample data for each category
  private data: CategoryData[] = [
    { category: 'Attendance', needed: 12, totalStudents: 20 },
    { category: 'Awareness', needed: 10, totalStudents: 26 },
    { category: 'Retake', needed: 7, totalStudents: 29 },
    { category: 'Homework', needed: 9, totalStudents: 27 },
    { category: 'Communication', needed: 10, totalStudents: 22 },
  ];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.createGroupedBarChart();
  }

  private createGroupedBarChart(): void {
    const container = d3
      .select(this.elementRef.nativeElement)
      .select('.bar-chart-container');
    const width = 1180;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const x0 = d3
      .scaleBand()
      .domain(this.data.map((d) => d.category))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const x1 = d3
      .scaleBand()
      .domain(['needed'])
      .range([0, x0.bandwidth()])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, 100]) // The percentage range (0 to 100%)
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal().domain(['needed']).range(['#fecaca']);

    const tooltip = d3
      .select(this.elementRef.nativeElement)
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', '#f4f4f4')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('box-shadow', '0 0 5px rgba(0,0,0,0.3)');

    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    svg
      .append('g')
      .selectAll('g')
      .data(y.ticks(5)) // Use y-axis ticks to create gridlines
      .data(this.data)
      .join('g')
      .attr('transform', (d) => `translate(${x0(d.category)},0)`)
      .selectAll('rect')
      .data((d) => [
        { key: 'needed', value: (d.needed / d.totalStudents) * 100 }, // Calculate percentage for 'needed'
      ])
      .join('rect')
      .attr('x', (d) => x1(d.key) || 0) // Ensure it returns a valid number, 0 as fallback for invalid key
      .attr('y', (d) => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', (d) => y(0) - y(d.value))
      .attr('fill', (d) => color(d.key) as string)
      .on('mouseover', (event, d) => {
        tooltip
          .style('visibility', 'visible')
          .text(
            `${
              d.key.charAt(0).toUpperCase() + d.key.slice(1)
            }: ${d.value.toFixed(1)}%`
          );
      })
      .on('mousemove', (event) => {
        tooltip
          .style('top', `${event.pageY - 10}px`)
          .style('left', `${event.pageX + 10}px`);
      })
      .on('mouseout', () => tooltip.style('visibility', 'hidden'));

    // X Axis
    // X Axis with gridlines
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0).tickSize(0)) // Normal X-axis without ticks
      .call((g) =>
        g
          .selectAll('.tick') // Add vertical gridlines at each X tick
          .data(this.data)
          .enter()
          .append('line')
          .attr('class', 'x-gridline')
          .attr('x1', (d) => (x0(d.category) || 0) + (x0.bandwidth() || 0) / 2) // Use 0 as fallback
          .attr('x2', (d) => (x0(d.category) || 0) + (x0.bandwidth() || 0) / 2) // Use 0 as fallback
          .attr('y1', 0)
          .attr('y2', -height + margin.top + margin.bottom)
          .attr('stroke', '#e0e0e0')
          .attr('stroke-dasharray', '2,2')
      )
      .call((g) => g.selectAll('.tick line').remove()); // Remove default tick lines

    // Y Axis with gridlines
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-width + margin.left + margin.right) // Extends gridlines across the chart width
          .tickFormat((d) => `${d}`)
      ) // Use a regular number format
      .call((g) => g.select('.domain').remove()) // Remove the main axis line
      .call((g) =>
        g
          .selectAll('.tick line') // Style the gridlines
          .attr('stroke', '#e0e0e0') // Light gray color for gridlines
          .attr('stroke-dasharray', '2,2')
      ); // Dashed lines for gridlines
  }
}
