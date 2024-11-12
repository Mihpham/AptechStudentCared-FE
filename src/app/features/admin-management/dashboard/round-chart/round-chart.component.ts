import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-round-chart',
  templateUrl: './round-chart.component.html',
  styleUrls: ['./round-chart.component.scss']
})
export class RoundChartComponent implements OnInit {
  public data = {
    attendance: { done: 10, needed: 12 },
    awareness: { done: 1, needed: 1 },
    retake: { retest: 5, reclass: 6, totalNeeded: 7 },
    homework: { lateSubmission: { done: 5, needed: 5 }, noSubmission: { done: 5, needed: 6 } },
    communication: { parentCommunication: { done: 9, needed: 11 }, ahCommunication: { done: 7, needed: 7 } }
  };
  public totalStudents = 20; // Add total number of students

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.drawAllPieCharts();
  }

  @HostListener('window:resize')
  onResize() {
    this.clearCharts();
    this.drawAllPieCharts();
  }

  private drawAllPieCharts() {
    this.createPieChart('attendance', [this.data.attendance.done, this.data.attendance.needed]);
    this.createPieChart('awareness', [this.data.awareness.done, this.data.awareness.needed]);
    this.createPieChart('retake', [this.data.retake.retest, this.data.retake.reclass]);
    this.createPieChart('homework', [
      this.data.homework.lateSubmission.done,
      this.data.homework.noSubmission.done
    ]);
    this.createPieChart('communication', [
      this.data.communication.parentCommunication.done,
      this.data.communication.ahCommunication.done
    ]);
  }

  private clearCharts() {
    d3.select(this.elementRef.nativeElement).selectAll('svg').remove();
  }

  private createPieChart(id: string, data: number[]): void {
    const container = d3.select(this.elementRef.nativeElement).select(`#${id} .chart-container`);
    const width = 100;
    const height = 100;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal()
      .domain(data.map(String))
      .range(['#bbf7d0', '#fecaca', ]);

    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const tooltip = d3.select(this.elementRef.nativeElement).append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', '#f4f4f4')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('box-shadow', '0 0 5px rgba(0,0,0,0.3)');

    const pie = d3.pie<number>().value(d => d);
    const data_ready = pie(data);

    const arc = d3.arc<d3.PieArcDatum<number>>()
      .innerRadius(0)
      .outerRadius(radius);

    svg
      .selectAll('path')
      .data(data_ready)
      .join('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.toString()) as string)
      .style('stroke', '#fff')
      .style('stroke-width', '2px')
      .on('mouseover', (event, d) => {
        tooltip.style('visibility', 'visible').text(`Value: ${d.data}`);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('top', `${event.pageY - 10}px`)
          .style('left', `${event.pageX + 10}px`);
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });
  }
}
