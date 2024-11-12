import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';

interface CategoryData {
  category: string;
  done: number;
  needed: number;
  totalStudents: number;  // Total number of students in each category
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  // Sample data for each category
  private data: CategoryData[] = [
    { category: 'Attendance', done: 10, needed: 12, totalStudents: 20 },
    { category: 'Awareness', done: 8, needed: 10, totalStudents: 26 },
    { category: 'Retake', done: 5, needed: 7, totalStudents: 29 },
    { category: 'Homework', done: 6, needed: 9, totalStudents: 27 },
    { category: 'Communication', done: 7, needed: 10, totalStudents: 22 }
  ];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.createGroupedBarChart();
  }

  private createGroupedBarChart(): void {
    const container = d3.select(this.elementRef.nativeElement).select('.bar-chart-container');
    const width = 1180;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const x0 = d3.scaleBand()
      .domain(this.data.map(d => d.category))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const x1 = d3.scaleBand()
      .domain(['done', 'needed'])
      .range([0, x0.bandwidth()])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, 100]) // The percentage range (0 to 100%)
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain(['done', 'needed'])
      .range(['#4CAF50', '#FF9800']);

    const tooltip = d3.select(this.elementRef.nativeElement).append('div')
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

    svg.append('g')
      .selectAll('g')
      .data(this.data)
      .join('g')
      .attr('transform', d => `translate(${x0(d.category)},0)`)
      .selectAll('rect')
      .data(d => [
        { key: 'done', value: (d.done / d.totalStudents) * 100 },  // Calculate percentage for 'done'
        { key: 'needed', value: (d.needed / d.totalStudents) * 100 }  // Calculate percentage for 'needed'
      ])
      .join('rect')
      .attr('x', d => x1(d.key) || 0) // Ensure it returns a valid number, 0 as fallback for invalid key
      .attr('y', d => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', d => y(0) - y(d.value))
      .attr('fill', d => color(d.key) as string)
      .on('mouseover', (event, d) => {
        tooltip
          .style('visibility', 'visible')
          .text(`${d.key.charAt(0).toUpperCase() + d.key.slice(1)}: ${d.value.toFixed(1)}%`);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('top', `${event.pageY - 10}px`)
          .style('left', `${event.pageX + 10}px`);
      })
      .on('mouseout', () => tooltip.style('visibility', 'hidden'));

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0).tickSize(0));

    // Y Axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .call(g => g.select('.domain').remove());
  }
}
