import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as d3 from 'd3';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { StudentPerformanceService } from 'src/app/core/services/admin/studentperformance.service';
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
  performanceData: StudentPerformanceResponse[] = [];
  totalPerformance: {
    presentCount: number;
    absentCount: number;
    presentWithPermissionCount: number;
    attendancePercentage: number;
    practicalPercentage: number;
    theoreticalScore: number;
  } = {
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.classId = +params['classId'];
      this.studentId = +params['studentId'];
      this.selectedSemester = 'SEM1'; 
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

    this.classService
      .getAllSubjectsBySemester(
        this.classId,
        this.studentId,
        semester === 'All' ? '' : semester
      )
      .subscribe(
        (data: any) => {
          if (data && data[semester]) {
            this.subjects = data[semester].map((subject: any) => ({
              id: subject.id,
              code: subject.subjectCode,
            }));
            this.selectedSubjectId = this.subjects[0]?.id;
            this.getStudentPerformance(semester);
          } else {
            console.error(`No subjects found for semester: ${semester}`);
            this.subjects = [];
          }
        },
        (error) => console.error('Error fetching subjects:', error)
      );
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

  createPerformanceLineChart(): void {
    if (this.performanceData.length === 0) return;

    // Clear the previous chart
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

    // Define the x and y scales
    const x = d3
        .scaleBand<string>()
        .domain(this.performanceData.map((d) => d.subjectCode)) // X-axis labels
        .range([0, width])
        .padding(0.1);

    const y = d3
        .scaleLinear<number>()
        .domain([0, 100]) // Set domain starting from 0
        .range([height, 0]);

    // Create the line generator function for each percentage type
    const lineGenerator = (valueKey: keyof StudentPerformanceResponse) =>
        d3
            .line<StudentPerformanceResponse>()
            .x((d) => x(d.subjectCode)! + x.bandwidth() / 2) // Center the points in the bands
            .y((d) => y(Number(d[valueKey]) || 0)) // Convert the value to a number and use 0 as a fallback
            .curve(d3.curveMonotoneX); // Optional: smooth curve

    // Draw lines for each percentage type
    const percentageTypes = ['theoreticalPercentage', 'attendancePercentage', 'practicalPercentage'] as const;
    const colors = ['steelblue', 'orange', 'green'];

    percentageTypes.forEach((type, index) => {
        svg
            .append('path')
            .datum(this.performanceData)
            .attr('fill', 'none')
            .attr('stroke', colors[index])
            .attr('stroke-width', 2)
            .attr('d', lineGenerator(type));
    });

    // Add circles for each data point
    svg
        .selectAll('.dot')
        .data(
            this.performanceData.flatMap((d) => [
                { ...d, type: 'theoreticalPercentage', value: d.theoreticalPercentage },
                { ...d, type: 'attendancePercentage', value: d.attendancePercentage },
                { ...d, type: 'practicalPercentage', value: d.practicalPercentage },
            ])
        )
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => x(d.subjectCode)! + x.bandwidth() / 2) // Center the circles
        .attr('cy', (d) => y(d.value)) // Position based on the value
        .attr('r', 4)
        .attr('fill', (d) => {
            switch (d.type) {
                case 'theoreticalPercentage':
                    return 'steelblue';
                case 'attendancePercentage':
                    return 'orange';
                case 'practicalPercentage':
                    return 'green';
                default:
                    return 'black';
            }
        });

    // Add the x-axis
    svg
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add the y-axis
    svg.append('g').call(d3.axisLeft(y));

   // Add percentage symbol at the intersection of the X and Y axes
svg
.append('text')
.attr('x', -margin.left / 11) // Move the symbol slightly right
.attr('y', height + margin.bottom / 5) // Move the symbol slightly up
.attr('text-anchor', 'middle')
.attr('fill', '#000')
.attr('font-size', '10px')
.text('%');

}


  showTooltip(event: MouseEvent, content: string) {
    d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', '#f4f4f4')
      .style('padding', '5px')
      .style('border', '1px solid #d4d4d4')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('left', `${event.pageX + 10}px`)
      .style('top', `${event.pageY + 10}px`)
      .html(content);
  }
  

  hideTooltip(): void {
    d3.select('.tooltip').remove();
  }

  // showTooltip(
  //   event: any,
  //   d: StudentPerformanceResponse,
  //   subjectCode: string
  // ): void {
  //   const tooltip = d3
  //     .select('body')
  //     .append('div')
  //     .attr('class', 'tooltip')
  //     .style('position', 'absolute')
  //     .style('background', '#f4f4f4')
  //     .style('padding', '5px')
  //     .style('border', '1px solid #d4d4d4')
  //     .style('border-radius', '4px')
  //     .style('pointer-events', 'none')
  //     .html(`${subjectCode}: ${d.theoreticalPercentage}%`);

  //   tooltip
  //     .style('left', `${event.pageX + 10}px`)
  //     .style('top', `${event.pageY - 28}px`);

  //   d3.select(event.currentTarget)
  //     .transition()
  //     .attr('r', 6)
  //     .attr('fill', '#000');
  // }

  // hideTooltip(event: any): void {
  //   d3.select('.tooltip').remove();
  //   d3.select(event.currentTarget).transition().attr('r', 4);
  // }

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
    if (!this.classId || !this.studentId || !this.semesters) return;

    this.classService
      .getAllSubjectsBySemester(this.classId, this.studentId, semester)
      .subscribe(
        (data: any) => {
          console.log('Received data:', data); // Check the structure here

          const semesterData = data[semester];
          if (!Array.isArray(semesterData)) {
            console.error(`No data found for semester: ${semester}`);
            return;
          }

          // Process the semester data
          this.performanceData = semesterData;

          // Aggregate the data across all subjects for this semester
          this.totalPerformance = {
            presentCount: this.getSum(
              semesterData.map((d: any) => d.presentCount)
            ),
            absentCount: this.getSum(
              semesterData.map((d: any) => d.absentCount)
            ),
            presentWithPermissionCount: this.getSum(
              semesterData.map((d: any) => d.presentWithPermissionCount)
            ),
            attendancePercentage:
              this.getAverage(
                semesterData.map((d: any) => d.attendancePercentage)
              ) || 0,
            practicalPercentage:
              this.getAverage(
                semesterData.map((d: any) => d.practicalPercentage)
              ) || 0,
            theoreticalScore:
              this.getAverage(
                semesterData.map((d: any) => d.theoreticalScore)
              ) || 0,
          };
          this.performanceMarks = [
            {
              label: 'Project Percentage',
              value:
                this.getAverage(
                  semesterData.map((d: any) => d.practicalScore)
                ) || 0,
            },
            {
              label: 'Attendance Percentage',
              value:
                this.getAverage(
                  semesterData.map((d: any) => d.attendancePercentage)
                ) || 0,
            },
            {
              label: 'Practical Percentage',
              value:
                this.getAverage(
                  semesterData.map((d: any) => d.practicalPercentage)
                ) || 0,
            },
            {
              label: 'Theoretical Score',
              value:
                this.getAverage(
                  semesterData.map((d: any) => d.theoreticalScore)
                ) || 0,
            },
          ];
          this.cdr.detectChanges();
          setTimeout(() => {
            this.performanceMarks.forEach((mark, i) => {
              this.createCircularCharts(`chart${i}`, mark.value);
            });
            this.createPerformanceLineChart(); // Pass performanceData correctly
          }, 0);
        },
        (error) => console.error('Error fetching student performance:', error)
      );
  }

  private getSum(values: number[]): number {
    return values.reduce((a, b) => a + b, 0);
  }
  private getAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
}
