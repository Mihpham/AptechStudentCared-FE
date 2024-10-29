import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as d3 from 'd3';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { StudentPerformanceResponse } from '../admin-management/model/student-performance/student-performance-response.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-performance',
  templateUrl: './student-performance.component.html',
  styleUrls: ['./student-performance.component.scss'],
})
export class StudentPerformanceComponent implements OnInit, AfterViewInit {
  classId: number | null = null;
  studentId: number | null = null;
  selectedSubjectId: number | null = null;
  selectedSemester = 'SEM1';
  subjects: { id: number; code: string }[] = [];
  performanceMarks: { label: string; value: number }[] = [];
  semesters = ['SEM1', 'SEM2', 'SEM3', 'SEM4'];
  performanceData: StudentPerformanceResponse['subjectPerformances'] = [];
  totalPerformance = {
    presentCount: 0,
    absentCount: 0,
    presentWithPermissionCount: 0,
    attendancePercentage: 0,
    practicalPercentage: 0,
    theoreticalScore: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.classId = +params['classId'];
      this.studentId = +params['studentId'];
      this.getSubjectsBySemester(this.selectedSemester);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.performanceData.length > 0) {
        this.createPerformanceLineChart();
      }
      this.performanceMarks.forEach((mark, i) => {
        this.createCircularCharts(`chart${i}`, mark.value);
      });
    }, 0);
  }

  getSubjectsBySemester(semester: string): void {
    if (!this.classId || !this.studentId) return;
  
    this.classService.getAllSubjectsBySemester(this.classId, this.studentId, semester).subscribe(
      (data: any) => {
        console.log('Fetched subjects data:', data); // Log the full response
        
        // Check if the semester data exists
        if (data && data[semester]) {
          this.subjects = data[semester].map((subject: any) => ({
            id: subject.id,
            code: subject.subjectCode,
          }));
          console.log('Subjects for the selected semester:', this.subjects); // Log the subjects
  
          this.selectedSubjectId = this.subjects[0]?.id;
          this.getStudentPerformance(semester);
        } else {
          console.warn(`No subjects found for semester: ${semester}`);
          this.toastr.error(`No subjects found for semester: ${semester}`);
          this.subjects = [];
        }
      },
      (error) => {
        console.error('Error fetching subjects:', error);
        if (error.status === 404) {
          this.toastr.error(`No subjects found for semester: ${semester}`);
        } else {
          console.error('Unknown error occurred:', error);
        }
        this.subjects = [];
      }
    );
  }
  
  

  createCircularCharts(chartId: string, value: number): void {
    const width = 100;
    const height = 100;
    const radius = Math.min(width, height) / 2;

    d3.select(`#${chartId}`).selectAll('*').remove();

    const svg = d3.select(`#${chartId}`)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const arc = d3.arc().innerRadius(30).outerRadius(radius);
    const pie = d3.pie<number>().value((d) => d);

    const data = [value, 100 - value];

    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc as any)
      .style('fill', (d, i) => (i === 0 ? '#4CAF50' : '#ddd'))
      .attr('stroke-width', 1);
  }

  createPerformanceLineChart(): void {
    if (this.performanceData.length === 0) return;

    d3.select('#performance-chart').selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select('#performance-chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand<string>()
      .domain(this.performanceData.map((d) => d.subjectCode))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear<number>()
      .domain([0, 100])
      .range([height, 0]);

    const lineGenerator = (valueKey: keyof StudentPerformanceResponse['subjectPerformances'][number]) =>
      d3.line<StudentPerformanceResponse['subjectPerformances'][number]>()
        .x((d) => x(d.subjectCode)! + x.bandwidth() / 2)
        .y((d) => y(d[valueKey] as number || 0))  // Use 'as number' to ensure compatibility
        .curve(d3.curveMonotoneX);

    const percentageTypes = ['theoreticalPercentage', 'attendancePercentage', 'practicalPercentage'] as const;
    const colors = ['steelblue', 'orange', 'green'];

    percentageTypes.forEach((type, index) => {
      svg.append('path')
        .datum(this.performanceData)
        .attr('fill', 'none')
        .attr('stroke', colors[index])
        .attr('stroke-width', 2)
        .attr('d', lineGenerator(type));
    });

    svg.selectAll('.dot')
      .data(this.performanceData.flatMap((d) => [
        { ...d, type: 'theoreticalPercentage', value: d.theoreticalPercentage },
        { ...d, type: 'attendancePercentage', value: d.attendancePercentage },
        { ...d, type: 'practicalPercentage', value: d.practicalPercentage },
      ]))
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => x(d.subjectCode)! + x.bandwidth() / 2)
      .attr('cy', (d) => y(d.value as number))  // Ensure value is treated as a number
      .attr('r', 4)
      .attr('fill', (d) => {
        switch (d.type) {
          case 'theoreticalPercentage': return 'steelblue';
          case 'attendancePercentage': return 'orange';
          case 'practicalPercentage': return 'green';
          default: return 'black';
        }
      })
      .on('mouseover', (event, d: any) => {
        const tooltipContent = `<strong>${d.subjectCode}</strong><br>${d.type.charAt(0).toUpperCase() + d.type.slice(1)}: ${d.value}%`;
        this.showTooltip(event, tooltipContent);
      })
      .on('mouseout', () => this.hideTooltip());

    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append('g').call(d3.axisLeft(y));
  }

  showTooltip(event: MouseEvent, content: string): void {
    d3.select('.tooltip').remove();
    d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', '#f4f4f4')
      .style('color', '#333')
      .style('padding', '5px')
      .style('border', '1px solid #d4d4d4')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('left', `${event.pageX + 10}px`)
      .style('top', `${event.pageY + 10}px`)
      .html(content)
      .transition()
      .duration(200)
      .style('opacity', 1);
  }

  hideTooltip(): void {
    d3.select('.tooltip')
      .transition()
      .duration(200)
      .style('opacity', 0)
      .remove();
  }

  onSubjectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSubjectId = +target.value;
    this.getStudentPerformance(this.selectedSemester);
  }

  onSemesterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSemester = target.value;
    this.getSubjectsBySemester(this.selectedSemester);
  }

  getStudentPerformance(semester: string): void {
    if (!this.classId || !this.studentId || !this.selectedSubjectId) return;
  
    // Call the correct method with the correct number of arguments
    this.classService.getAllSubjectsBySemester(this.classId, this.studentId, semester).subscribe(
      (data: StudentPerformanceResponse[]) => {
        if (data && data.length > 0) {
          // Assuming you want the first item for performance data
          const studentPerformance = data[0]; // Adjust as necessary based on your data structure
  
          this.performanceData = studentPerformance.subjectPerformances;
  
          this.totalPerformance = {
            presentCount: this.getSum(this.performanceData.map((d) => d.presentCount)),
            absentCount: this.getSum(this.performanceData.map((d) => d.absentCount)),
            presentWithPermissionCount: this.getSum(this.performanceData.map((d) => d.presentWithPermissionCount)),
            attendancePercentage: this.getAverage(this.performanceData.map((d) => d.attendancePercentage)) || 0,
            practicalPercentage: this.getAverage(this.performanceData.map((d) => d.practicalPercentage)) || 0,
            theoreticalScore: this.getAverage(this.performanceData.map((d) => d.theoreticalScore)) || 0,
          };
  
          this.performanceMarks = [
            { label: 'Attendance Percentage', value: this.totalPerformance.attendancePercentage },
            { label: 'Practical Percentage', value: this.totalPerformance.practicalPercentage },
            { label: 'Theoretical Score', value: this.totalPerformance.theoreticalScore },
            { label: 'Total Percentage Sem1', value: this.calculateNewPercentage() || 0 },
          ];
  
          setTimeout(() => {
            this.performanceMarks.forEach((mark, i) => {
              this.createCircularCharts(`chart${i}`, mark.value);
            });
            this.createPerformanceLineChart();
          }, 0);
        } else {
          this.toastr.error('No performance data found for the selected semester.');
        }
      },
      (error) => {
        console.error('Error fetching student performance:', error);
        this.toastr.error('Error fetching student performance data.');
      }
    );
  }
  

  private calculateNewPercentage(): number {
    const projectScore = this.performanceData.find((subject) => subject.subjectCode === 'Project1')?.practicalPercentage || 0;
    console.log(projectScore);
    
    const scores = this.performanceData.flatMap((subject) => {
      const theoretical = subject.theoreticalPercentage || 0;
      const practical = subject.practicalPercentage || 0;
      return [subject.subjectCode === 'Project1' ? 0 : theoretical, practical];
    });

    const totalScore = scores.reduce((total, score) => total + score, 0);
    const count = scores.filter((score) => score > 0).length;

    return count > 0 ? totalScore / count : 0;
  }

  private getSum(values: number[]): number {
    return values.reduce((a, b) => a + b, 0);
  }

  private getAverage(values: number[]): number {
    return values.length === 0 ? 0 : this.getSum(values) / values.length;
  }
}
