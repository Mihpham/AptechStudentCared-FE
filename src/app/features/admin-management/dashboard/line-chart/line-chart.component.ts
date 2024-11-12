import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  Input,
  SimpleChanges,
} from '@angular/core';
import * as d3 from 'd3';
import { ReportService } from 'src/app/core/services/admin/report.service';
import { ReportData } from '../../model/report/report.model';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  private data: {
    category: string;
    DiscussionsNeeded: number;
    DiscussionsDone: number;
  }[] = [];
  @Input() selectedSubject: string = '';
  private svg: any;
  private tooltip: any;
  private margin = 50;
  private width = 1150 - this.margin * 2;
  private height = 400 - this.margin * 2;
  private barPadding = 0.2; // Space between grouped bars

  constructor(private el: ElementRef, private reportService: ReportService) {}

  ngOnInit(): void {
    window.addEventListener('resize', () => this.resizeChart());
    this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Watch for changes in selectedSubject and update the chart accordingly
    if (changes['selectedSubject'] && this.selectedSubject) {
      this.updateChartData();
    }
  }
  private updateChartData(): void {
    const reports = this.reportService.getAllReports();
    const filteredReports = reports.filter(
      (report) => report.subject === this.selectedSubject
    );

    // If no reports are found for the selected subject, exit early
    if (filteredReports.length === 0) {
      console.log('No reports found for this subject.');
      return;
    }

    if (filteredReports.length === 0) {
      console.log('No reports found for this subject.');
      return;
    }
    // Format data for grouped bar chart, flattening each breakdown category for each subject
    this.data = reports.flatMap((report: ReportData) => [
      {
        category: `${report.subject} - Late`,
        DiscussionsNeeded: report.breakdown?.late.needed || 0,
        DiscussionsDone: report.breakdown?.late.done || 0,
      },
      {
        category: `${report.subject} - Absence`,
        DiscussionsNeeded: report.breakdown?.absence.needed || 0,
        DiscussionsDone: report.breakdown?.absence.done || 0,
      },
      {
        category: `${report.subject} - Awareness`,
        DiscussionsNeeded: report.breakdown?.awareness.needed || 0,
        DiscussionsDone: report.breakdown?.awareness.done || 0,
      },
      {
        category: `${report.subject} - Competency`,
        DiscussionsNeeded: report.breakdown?.competency.needed || 0,
        DiscussionsDone: report.breakdown?.competency.done || 0,
      },
      {
        category: `${report.subject} - Homework Late Submission`,
        DiscussionsNeeded:
          report.breakdown?.homework.lateSubmission.needed || 0,
        DiscussionsDone: report.breakdown?.homework.lateSubmission.done || 0,
      },
      {
        category: `${report.subject} - Homework No Submission`,
        DiscussionsNeeded: report.breakdown?.homework.noSubmission.needed || 0,
        DiscussionsDone: report.breakdown?.homework.noSubmission.done || 0,
      },
      {
        category: `${report.subject} - Retest`,
        DiscussionsNeeded: report.breakdown?.retake.retest.needed || 0,
        DiscussionsDone: report.breakdown?.retake.retest.done || 0,
      },
      {
        category: `${report.subject} - Reclass`,
        DiscussionsNeeded: report.breakdown?.retake.reclass.needed || 0,
        DiscussionsDone: report.breakdown?.retake.reclass.done || 0,
      },
      {
        category: `${report.subject} - Parent Communication`,
        DiscussionsNeeded:
          report.breakdown?.communication.parentCommunication.needed || 0,
        DiscussionsDone:
          report.breakdown?.communication.parentCommunication.done || 0,
      },
      {
        category: `${report.subject} - AH Communication`,
        DiscussionsNeeded:
          report.breakdown?.communication.ahCommunication.needed || 0,
        DiscussionsDone:
          report.breakdown?.communication.ahCommunication.done || 0,
      },
    ]);

    console.log(this.data);
    this.createSvg();
    this.createTooltip();
    this.drawBarChart(this.data);
  }
  private createSvg(): void {
    const element = this.el.nativeElement.querySelector('figure#chart');
    const boundingWidth = element.clientWidth;

    this.width = boundingWidth - this.margin * 2;

    d3.select(element).select('svg').remove();

    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', boundingWidth)
      .attr('height', this.height + this.margin * 2 + 30)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private createTooltip(): void {
    this.tooltip = d3
      .select('figure#chart')
      .append('div')
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', '1px solid #d3d3d3')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')
      .style('opacity', 0);
  }

  private drawBarChart(
    data: {
      category: string;
      DiscussionsNeeded: number;
      DiscussionsDone: number;
    }[]
  ): void {
    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([0, this.width])
      .padding(this.barPadding);

    const x1 = d3
      .scaleBand()
      .domain(['DiscussionsNeeded', 'DiscussionsDone'])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => Math.max(d.DiscussionsNeeded, d.DiscussionsDone))!,
      ])
      .range([this.height, 0]);

    this.svg
      .append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x0))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    this.svg.append('g').call(d3.axisLeft(y));

    const color = d3
      .scaleOrdinal()
      .domain(['DiscussionsNeeded', 'DiscussionsDone'])
      .range(['#fecaca', '#bbf7d0']); // Colors for the bars

    const barGroups = this.svg
      .selectAll('.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr(
        'transform',
        (d: { category: string }) => `translate(${x0(d.category)!},0)`
      );

    barGroups
      .selectAll('rect')
      .data((d: { DiscussionsNeeded: any; DiscussionsDone: any }) => [
        { key: 'DiscussionsNeeded', value: d.DiscussionsNeeded },
        { key: 'DiscussionsDone', value: d.DiscussionsDone },
      ])
      .enter()
      .append('rect')
      .attr('x', (d: { key: string }) => x1(d.key)!)
      .attr('y', (d: { value: d3.NumberValue }) => y(d.value))
      .attr('width', x1.bandwidth())
      .attr(
        'height',
        (d: { value: d3.NumberValue }) => this.height - y(d.value)
      )
      .attr('fill', (d: { key: string }) => color(d.key) as string)
      .on('mouseover', (event: any, d: any) => this.showTooltip(event, d))
      .on('mouseout', () => this.hideTooltip());

    this.drawLegend();
  }

  private showTooltip(event: any, d: any): void {
    const text = `<strong>${d.key}</strong>: ${d.value}`;

    this.tooltip
      .style('opacity', 1)
      .html(text)
      .style('left', event.pageX + 10 + 'px')
      .style('top', event.pageY - 10 + 'px');
  }

  private hideTooltip(): void {
    this.tooltip.style('opacity', 0);
  }

  private drawLegend(): void {
    const color = d3
      .scaleOrdinal()
      .domain(['DiscussionsNeeded', 'DiscussionsDone'])
      .range(['#fecaca', '#bbf7d0']);

    const legend = this.svg
      .append('g')
      .attr('transform', `translate(${this.width - 100}, -30)`);

    legend
      .selectAll('legendItem')
      .data(['DiscussionsNeeded', 'DiscussionsDone'])
      .enter()
      .append('g')
      .attr('transform', (_d: any, i: number) => `translate(0, ${i * 20})`)
      .call(
        (g: {
          append: (arg0: string) => {
            (): any;
            new (): any;
            attr: {
              (arg0: string, arg1: number): {
                (): any;
                new (): any;
                attr: {
                  (arg0: string, arg1: number): {
                    (): any;
                    new (): any;
                    attr: {
                      (arg0: string, arg1: (d: any) => string): void;
                      new (): any;
                    };
                    text: {
                      (arg0: (d: any) => any): {
                        (): any;
                        new (): any;
                        style: {
                          (arg0: string, arg1: string): {
                            (): any;
                            new (): any;
                            attr: {
                              (arg0: string, arg1: string): void;
                              new (): any;
                            };
                          };
                          new (): any;
                        };
                      };
                      new (): any;
                    };
                  };
                  new (): any;
                };
              };
              new (): any;
            };
          };
        }) => {
          g.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', (d) => color(d) as string);

          g.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .text((d) => d)
            .style('font-size', '12px')
            .attr('alignment-baseline', 'middle');
        }
      );
  }

  private resizeChart(): void {
    this.createSvg();
    this.drawBarChart(this.data);
  }
}
