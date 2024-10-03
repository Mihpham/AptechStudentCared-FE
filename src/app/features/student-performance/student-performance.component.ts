import { StudentPerformanceService } from './../../core/services/admin/studentperformance.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as d3 from 'd3';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { StudentRequest } from '../admin-management/model/student-request.model';
import { StudentPerformanceResponse } from '../admin-management/model/student-performance/student-performance-response.model';

@Component({
  selector: 'app-student-performance',
  templateUrl: './student-performance.component.html',
  styleUrls: ['./student-performance.component.scss'],
})
export class StudentPerformanceComponent implements OnInit, AfterViewInit {
  classId: number | null = null; // Khởi tạo với null
  studentId: number | null = null; // Khai báo userId
  selectedSubjectId: number | null = null; // ID môn học đã chọn

  selectedSubject: string | null = null;

  selectedSemester = 'All';
  subjects: { id: number; code: string }[] = []; // Khai báo subjects như một mảng đối tượng
  performanceMarks: { label: string; value: number }[] = [];

  semesters = ['SEM1', 'SEM2', 'SEM3', 'SEM4'];

  marksSummary = [53.6, 75, 76.5]; // Avg Mark of Practice, Evaluation, Theory

  perfperformanceData1: StudentPerformanceResponse[] | undefined;

  performanceData = [
    {
      semester: 'SEM1',
      attendance: 85,
      theory: 72,
      practice: 65,
      evaluation: 70,
    },
    {
      semester: 'SEM2',
      attendance: 90,
      theory: 76,
      practice: 68,
      evaluation: 75,
    },
    {
      semester: 'SEM3',
      attendance: 88,
      theory: 78,
      practice: 71,
      evaluation: 78,
    },
    {
      semester: 'SEM4',
      attendance: 92,
      theory: 80,
      practice: 75,
      evaluation: 80,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private studentPFService: StudentPerformanceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.classId = +params['classId'];
      this.studentId = +params['studentId'];
      this.getSubjectsBySemester(this.selectedSemester); // Gọi API cho semester đầu tiên
      this.getStudentPerformance();
    });
  }

  ngAfterViewInit(): void {
    // this.createPerformanceGroupedBarChart();
    // this.performanceMarks.forEach((mark, i) => {
    //   this.createCircularCharts(`chart${i}`, mark.value); // Gọi hàm vẽ cho mỗi biểu đồ
    // });
    setTimeout(() => {
      this.createPerformanceGroupedBarChart();
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
              id: subject.id, // ID of the subject
              code: subject.subjectCode, // Code of the subject
            }));
            this.selectedSubjectId = this.subjects[0]?.id; // Select the ID of the first subject
            this.getStudentPerformance(); // Fetch performance data for the selected subject
          } else {
            console.error(`No subjects found for semester: ${semester}`);
            this.subjects = []; // Set an empty array if no subjects are found
          }
        },
        (error) => {
          console.error('Error fetching subjects:', error);
        }
      );
    }
  }

  createCircularCharts(chartId: string, value: number) {
    console.log(`Creating chart for ${chartId} with value ${value}`);
    console.log("ELEMENT",document.getElementById(chartId));
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
      .attr('stroke', 'black') // Thêm viền để kiểm tra
      .attr('stroke-width', 1);

      console.log("CHECKSVG",d3.select(`#${chartId}`).node()); // Kiểm tra xem SVG có tồn tại hay không
      console.log(pie(data)); // Kiểm tra cấu trúc dữ liệu sau khi qua pie()
      console.log(svg.selectAll('.arc').data(pie(data))); // Kiểm tra dữ liệu bind vào các phần tử
          
  }
  

  createPerformanceGroupedBarChart() {
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select('#performance-chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x0 = d3
      .scaleBand<string>()
      .domain(this.performanceData.map((d) => d.semester))
      .range([0, width])
      .padding(0.2);

    const x1 = d3
      .scaleBand<string>()
      .domain(['attendance', 'theory', 'practice', 'evaluation'])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear<number>().domain([0, 100]).range([height, 0]);

    const color = d3
      .scaleOrdinal<string>()
      .domain(['attendance', 'theory', 'practice', 'evaluation'])
      .range(['#4285F4', '#34A853', '#FBBC05', '#EA4335']); // Pastel colors

    // Draw axes
    svg
      .append('g')
      .call(d3.axisBottom(x0))
      .attr('transform', `translate(0,${height})`);

    svg.append('g').call(d3.axisLeft(y));

    // Grouped bars
    svg
      .selectAll('.semester-group')
      .data(this.performanceData)
      .enter()
      .append('g')
      .attr('class', 'semester-group')
      .attr('transform', (d) => `translate(${x0(d.semester)}, 0)`)
      .selectAll('rect')
      .data((d) =>
        ['attendance', 'theory', 'practice', 'evaluation'].map((key) => ({
          key,
          value: +d[key as keyof typeof d], // Ensure the value is cast to a number
        }))
      )
      .enter()
      .append('rect')
      .attr('x', (d) => x1(d.key)!)
      .attr('y', (d) => y(+d.value)) // Cast to number
      .attr('width', x1.bandwidth())
      .attr('height', (d) => height - y(+d.value)) // Cast to number
      .attr('fill', (d) => color(d.key))

      .on('mouseout', (event: any) => {
        d3.select(event.target).transition().attr('opacity', 1);
      })
      .on('mouseover', (event: any, d: any) => {
        // Remove any existing labels
        svg.selectAll('.label').remove();

        // Append text labels showing the percentage value
        svg
          .append('text')
          .attr('class', 'label')
          .attr('x', +d3.select(event.target).attr('x') + x1.bandwidth() * 1.6)
          .attr('y', +d3.select(event.target).attr('y') - 5) // Position slightly above the bar
          .attr('text-anchor', 'middle')
          .style('fill', 'black')
          .text(`${d.value}%`)
          .style('font-size', '10px')
          .transition()
          .duration(300)
          .style('opacity', 1);
      });
  }

  drawBar(
    svg: any,
    x: any,
    y: any,
    key: keyof (typeof this.performanceData)[0],
    color: string,
    height: number // Add height as an argument
  ) {
    svg
      .selectAll(`.bar-${key}`)
      .data(this.performanceData)
      .enter()
      .append('rect')
      .attr('class', `bar-${key}`)
      .attr('x', (d: any) => x(d.semester)! + x.bandwidth() / 4) // Adjust position
      .attr('y', (d: any) => y(d[key]))
      .attr('width', x.bandwidth() / 2) // Adjust width for multiple bars
      .attr('height', (d: any) => height - y(d[key])) // Use height passed as argument
      .attr('fill', color)
      .on('mouseover', (event: any, d: any) => {
        d3.select(event.target).transition().attr('opacity', 0.7);
      })
      .on('mouseout', (event: any) => {
        d3.select(event.target).transition().attr('opacity', 1);
      });
  }

  onSubjectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.selectedSubjectId = +target.value; // Lấy ID môn học từ giá trị của tùy chọn
      this.getStudentPerformance(); // Gọi lại phương thức để lấy dữ liệu hiệu suất mới
    }
  }

  onSemesterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.selectedSemester = target.value;
      this.getSubjectsBySemester(this.selectedSemester); // Gọi API khi semester thay đổi
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
              this.perfperformanceData1 = [data];

              // Prepare data for specific marks
              this.performanceMarks = [
                {
                  label: 'Theoretical Mark',
                  value: data.theoreticalPercentage || 0,
                },
                {
                  label: 'Attendance',
                  value: data.attendancePercentage || 0,
                },
                {
                  label: 'Participation',
                  value: data.practicalPercentage || 0,
                },
              ];

              // Call the chart function for each mark with its specific index
              this.performanceMarks.forEach((mark, i) => {
                this.createCircularCharts(`chart${i}`, mark.value);
              });
            } else {
              this.performanceMarks = []; // Reset if no data
            }
          },
          (error) => {
            console.error('Error fetching student performance:', error);
          }
        );
    }
  }
}
