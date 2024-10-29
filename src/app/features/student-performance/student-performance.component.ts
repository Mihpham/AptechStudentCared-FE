import {AfterViewInit, ChangeDetectorRef, Component, OnInit,} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as d3 from 'd3';
import {ClassService} from 'src/app/core/services/admin/class.service';
import {
  StudentPerformanceResponse
} from '../admin-management/model/student-performance/student-performance-response.model';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-student-performance',
  templateUrl: './student-performance.component.html',
  styleUrls: ['./student-performance.component.scss'],
})
export class StudentPerformanceComponent implements OnInit, AfterViewInit {
  classId: number | null = null;
  studentId: number | null = null;
  selectedSubjectId: number | null = null;
  selectedSemester = '';
  subjects: { id: number; code: string }[] = [];
  performanceMarks: { label: string; value: number }[] = [];
  semesters = ['SEM1', 'SEM2', 'SEM3', 'SEM4'];
  performanceData: StudentPerformanceResponse[] = [];
  firstSubjectSchedules: string = '';
  lastSubjectSchedules: string = '';
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
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
  }

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
        this.createPerformanceLineChart(this.firstSubjectSchedules, this.lastSubjectSchedules);
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
          const performances = data.subjectPerformances;

          if (performances && performances.length > 0) {
            this.subjects = performances.map((subject: any) => ({
              id: subject.id,
              code: subject.subjectCode,
            }));
            this.selectedSubjectId = this.subjects[0]?.id;
            this.getStudentPerformance(semester);
          } else {
            this.toastr.error(`No subjects found for semester: ${semester}`);
            this.performanceMarks = [];
            this.subjects = [];
          }
        },
        (error) => {
          if (error.status === 404) {
            this.toastr.error(`No subjects found for semester: ${semester}`);
            this.performanceMarks = [];
            this.subjects = [];
          } else {
            console.error('Error fetching subjects:', error);
          }
        }
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

  createPerformanceLineChart(firstSubjectSchedules: string, lastSubjectSchedules: string): void {
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

    // Set default font style
    const defaultFontFamily = 'Arial';
    const defaultFontSize = '8px';

    // Chart title with unified font style
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 44)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Arial')
      .style('font', 'bold')
      .style('font-size', '6px')
      .text(`First: ${firstSubjectSchedules} - Last: ${lastSubjectSchedules}`);

    // Define the x and y scales
    const x = d3
      .scaleBand<string>()
      .domain(this.performanceData.map((d) => d.subjectCode))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear<number>()
      .domain([0, 100])
      .range([height, 0]);

    const lineGenerator = (valueKey: keyof StudentPerformanceResponse) =>
      d3
        .line<StudentPerformanceResponse>()
        .x((d) => x(d.subjectCode)! + x.bandwidth() / 2)
        .y((d) => y(Number(d[valueKey]) || 0))
        .curve(d3.curveMonotoneX);

    // Draw lines for each percentage type
    const percentageTypes = [
      'theoreticalPercentage',
      'attendancePercentage',
      'practicalPercentage',
    ] as const;
    const colors = ['steelblue', 'orange', 'green'];

    percentageTypes.forEach((type, index) => {
      svg
        .append('path')
        .datum(this.performanceData)
        .attr('fill', 'none')
        .attr('stroke', colors[index])
        .attr('stroke-width', 1)
        .style('font-size', '8px')
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
      .attr('cx', (d) => x(d.subjectCode)! + x.bandwidth() / 2)
      .attr('cy', (d) => y(d.value))
      .attr('r', 2)
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
      })
      .on('mouseover', (event, d: any) => {
        let tooltipContent = `<strong>${d.subjectCode}</strong><br>`;
        switch (d.type) {
          case 'attendancePercentage':
            tooltipContent += `Attendance: ${d.attendancePercentage}%<br>`;
            break;
          case 'theoreticalPercentage':
            tooltipContent += `Theoretical: ${d.theoreticalPercentage}%<br>`;
            break;
          case 'practicalPercentage':
            tooltipContent += `Practical: ${d.practicalPercentage}%<br>`;
            break;
        }
        this.showTooltip(event, tooltipContent);
      })
      .on('mouseout', () => this.hideTooltip());

    // Add the x-axis with unified font style
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-family', defaultFontFamily)
      .style('font-size', defaultFontSize);

    // Add the y-axis with unified font style
    svg
      .append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-family', defaultFontFamily)
      .style('font-size', defaultFontSize);
  }


  showTooltip(event: MouseEvent, content: string): void {
    // Remove any existing tooltip before creating a new one
    d3.select('.tooltip').remove();

    // Create tooltip
    d3.select('body')
      .append('div')
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
      .style('opacity', 1); // Fade in the tooltip
  }

  hideTooltip(): void {
    // Smoothly fade out and remove the tooltip
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

  onSemesterChange(event: Event) {
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
          this.firstSubjectSchedules = data.firstSubjectSchedules || '';
          this.lastSubjectSchedules = data.lastSubjectSchedules || '';

          const {subjectPerformances} = data;
          const semesterData = subjectPerformances;
          if (!Array.isArray(semesterData)) {
            console.error(`No data found for semester: ${semester}`);
            return;
          }

          this.performanceData = semesterData;

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

          const newPercentage = this.calculateNewPercentage();
          this.performanceMarks = [
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
            {
              label: 'Total Percentage Sem1',
              value: newPercentage || 0,
            },
          ];

          setTimeout(() => {
            this.performanceMarks.forEach((mark, i) => {
              this.createCircularCharts(`chart${i}`, mark.value);
            });
            this.createPerformanceLineChart(this.firstSubjectSchedules, this.lastSubjectSchedules);
          }, 0);
        },
        (error) => console.error('Error fetching student performance:', error)
      );
  }


  private calculateNewPercentage(): number {
    const projectScore =
      this.performanceData.find((subject) => subject.subjectCode === 'Project1')
        ?.practicalPercentage || 0;

    // Mảng chứa tổng điểm lý thuyết và thực hành
    const scores = this.performanceData.flatMap((subject) => {
      const theoretical = subject.theoreticalPercentage || 0;
      const practical = subject.practicalPercentage || 0;
      // Chỉ lấy điểm thực hành của Project1
      return [subject.subjectCode === 'Project1' ? 0 : theoretical, practical];
    });

    console.log('Scores:', scores);

    const totalScore = scores.reduce((total, score) => total + score, 0);
    console.log(totalScore);

    const count = scores.filter((score) => score > 0).length;
    console.log(count);

    // Tính tỷ lệ
    const percentage = totalScore / count;
    return percentage;
  }

  private getSum(values: number[]): number {
    return values.reduce((a, b) => a + b, 0);
  }

  private getAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
}
