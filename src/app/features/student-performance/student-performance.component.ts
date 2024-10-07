// src/app/features/student-performance/student-performance.component.ts

import { StudentPerformanceService } from './../../core/services/admin/studentperformance.service';
import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as d3 from 'd3';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { StudentPerformanceResponse } from '../admin-management/model/student-performance/student-performance-response.model';

@Component({
  selector: 'app-student-performance',
  templateUrl: './student-performance.component.html',
  styleUrls: ['./student-performance.component.scss'],
})
export class StudentPerformanceComponent implements OnInit, AfterViewInit {
  classId: number | null = null;
  studentId: number | null = null;
  selectedSubjectId: number | null = null;
  selectedSemester = 'All';
  subjects: { id: number; code: string }[] = [];
  performanceMarks: { label: string; value: number }[] = [];
  semesters = ['SEM1', 'SEM2', 'SEM3', 'SEM4'];

  // Correctly declare and initialize performanceData as an array
  performanceData: StudentPerformanceResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private studentPFService: StudentPerformanceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.classId = +params['classId'];
      this.studentId = +params['studentId'];
      this.getSubjectsBySemester(this.selectedSemester);
      this.getStudentPerformance();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.performanceData.length > 0) {
        this.createPerformanceLineChart(this.performanceData);
      }
      this.performanceMarks.forEach((mark, i) => {
        this.createCircularCharts(`chart${i}`, mark.value);
      });
    }, 0);
  }

  getSubjectsBySemester(semester: string): void {
    if (semester && this.classId) {
      this.classService.getSubjects(this.classId, semester).subscribe(
        (data: any) => {
          if (data && data[semester]) {
            this.subjects = data[semester].map((subject: any) => ({
              id: subject.id,
              code: subject.subjectCode,
            }));
            this.selectedSubjectId = this.subjects[0]?.id;
            this.getStudentPerformance();
          } else {
            console.error(`No subjects found for semester: ${semester}`);
            this.subjects = [];
          }
        },
        (error) => {
          console.error('Error fetching subjects:', error);
        }
      );
    }
  }

  createCircularCharts(chartId: string, value: number): void {
    const width = 100;
    const height = 100;
    const radius = Math.min(width, height) / 2;

    d3.select(`#${chartId}`).selectAll('*').remove();

    const svg = d3
      .select(`#${chartId}`)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const arc = d3.arc().innerRadius(30).outerRadius(radius);
    const pie = d3.pie<number>().value((d) => d);

    const data = [value, 100 - value];

    const arcs = svg
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc as any)
      .style('fill', (d, i) => (i === 0 ? '#4CAF50' : '#ddd'))
      .attr('stroke-width', 1);
  }

  createPerformanceLineChart(performanceData: StudentPerformanceResponse[]): void {
    if (performanceData.length > 0) {
      // Clear any existing SVG content
      d3.select('#performance-chart').selectAll('*').remove();

      const margin = { top: 20, right: 30, bottom: 50, left: 60 };
      const width = 600 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      const svg = d3
        .select('#performance-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Define scales
      const x = d3
        .scalePoint<string>()
        .domain(performanceData.map((d) => d.subjectCode))
        .range([0, width])
        .padding(0.5);

      const y = d3
        .scaleLinear<number>()
        .domain([0, 100])
        .range([height, 0]);

      // Define line generators for the three metrics
      const lineAttendance = d3
        .line<StudentPerformanceResponse>()
        .x((d) => x(d.subjectCode)!)
        .y((d) => y(d.attendancePercentage))
        .curve(d3.curveMonotoneX);

      const lineTheory = d3
        .line<StudentPerformanceResponse>()
        .x((d) => x(d.subjectCode)!)
        .y((d) => y(d.theoreticalPercentage))
        .curve(d3.curveMonotoneX);

      const linePractice = d3
        .line<StudentPerformanceResponse>()
        .x((d) => x(d.subjectCode)!)
        .y((d) => y(d.practicalPercentage))
        .curve(d3.curveMonotoneX);
    
      // Add X axis
      svg
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('dy', '1em')
        .attr('dx', '-0.8em')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

      // Add Y axis
      svg.append('g').call(d3.axisLeft(y));

      // Add lines
      svg
        .append('path')
        .datum(performanceData)
        .attr('fill', 'none')
        .attr('stroke', '#4285F4') // Attendance - Blue
        .attr('stroke-width', 2)
        .attr('d', lineAttendance);

      svg
        .append('path')
        .datum(performanceData)
        .attr('fill', 'none')
        .attr('stroke', '#FBBC05') // Theory - Yellow
        .attr('stroke-width', 2)
        .attr('d', lineTheory);

      svg
        .append('path')
        .datum(performanceData)
        .attr('fill', 'none')
        .attr('stroke', '#34A853') // Practice - Green
        .attr('stroke-width', 2)
        .attr('d', linePractice);

      // Define categories with type-safe keys
      const categories: { 
        key: 'attendancePercentage' | 'theoreticalPercentage' | 'practicalPercentage'; 
        color: string; 
        label: string 
      }[] = [
        { key: 'attendancePercentage', color: '#4285F4', label: 'Attendance' },
        { key: 'theoreticalPercentage', color: '#FBBC05', label: 'Theoretical' },
        { key: 'practicalPercentage', color: '#34A853', label: 'Practical' },
      ];

      // Add points for each category
      categories.forEach((category) => {
        svg
          .selectAll(`.dot-${category.key}`)
          .data(performanceData)
          .enter()
          .append('circle')
          .attr('class', `dot-${category.key}`)
          .attr('cx', (d) => x(d.semester)!)
          .attr('cy', (d) => y(d[category.key]))
          .attr('r', 4)
          .attr('fill', category.color)
          .on('mouseover', (event: any, d) => {
            const tooltip = d3
              .select('body')
              .append('div')
              .attr('class', 'tooltip')
              .style('position', 'absolute')
              .style('background', '#f4f4f4')
              .style('padding', '5px')
              .style('border', '1px solid #d4d4d4')
              .style('border-radius', '4px')
              .style('pointer-events', 'none')
              .html(`${category.label}: ${d[category.key]}%`);

            tooltip
              .style('left', event.pageX + 10 + 'px')
              .style('top', event.pageY - 28 + 'px');

            d3.select(event.currentTarget).transition().attr('r', 6).attr('fill', '#000');
          })
          .on('mouseout', (event) => {
            d3.select('.tooltip').remove();
            d3.select(event.currentTarget).transition().attr('r', 4).attr('fill', category.color);
          });
      });
    } else {
      console.warn('No performance data available to create the chart.');
    }
  }

  onSubjectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.selectedSubjectId = +target.value;
      this.getStudentPerformance();
    }
  }

  onSemesterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.selectedSemester = target.value;
      this.getSubjectsBySemester(this.selectedSemester);
    }
  }

  getStudentPerformance(): void {
    if (this.classId && this.studentId && this.selectedSubjectId) {
      const subjectId = this.selectedSubjectId.toString();

      this.studentPFService
        .getStudentPerformance(this.classId, this.studentId, subjectId)
        .subscribe(
          (data: StudentPerformanceResponse) => {
            if (data) {
              // Assign as an array
              this.performanceData = [data];

              // Setup performance marks
              this.performanceMarks = [
                { label: 'Theoretical Mark', value: data.theoreticalPercentage || 0 },
                { label: 'Attendance', value: data.attendancePercentage || 0 },
                { label: 'Practical', value: data.practicalPercentage || 0 },
              ];

              this.cdr.detectChanges();
              setTimeout(() => {
                this.performanceMarks.forEach((mark, i) => {
                  this.createCircularCharts(`chart${i}`, mark.value);
                });
                this.createPerformanceLineChart(this.performanceData); // Pass performanceData correctly
              }, 0);
            } else {
              this.performanceMarks = [];
            }
          },
          (error) => {
            console.error('Error fetching student performance:', error);
          }
        );
    }
  }
}
