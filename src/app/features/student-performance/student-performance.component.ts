import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-student-performance',
  templateUrl: './student-performance.component.html',
  styleUrls: ['./student-performance.component.scss']
})
export class StudentPerformanceComponent implements OnInit {
  data = [
    { subject: 'EPC', semester: 'sem1', attendance: 80, theory: 75, practice: 65, evaluation: 90 },
    { subject: 'EAD', semester: 'sem1', attendance: 60, theory: 80, practice: 55, evaluation: 85 },
    { subject: 'MVC', semester: 'sem2', attendance: 90, theory: 85, practice: 75, evaluation: 95 },
    { subject: 'JAVA1', semester: 'sem2', attendance: 70, theory: 65, practice: 85, evaluation: 80 },
    { subject: 'JAVA2', semester: 'sem1', attendance: 85, theory: 60, practice: 90, evaluation: 75 },
    { subject: 'HTML', semester: 'sem2', attendance: 50, theory: 70, practice: 80, evaluation: 85 },
    { subject: 'React', semester: 'sem1', attendance: 95, theory: 95, practice: 60, evaluation: 80 },
    { subject: 'PHP', semester: 'sem2', attendance: 40, theory: 45, practice: 70, evaluation: 60 },
    { subject: '.NET', semester: 'sem1', attendance: 100, theory: 85, practice: 80, evaluation: 90 },
  ];

  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  private selectedSubject: string = 'all';
  private selectedSemester: string = 'all';

  constructor() {}

  ngOnInit(): void {
    this.createSvg();
    this.drawLines();
    this.setupEventListeners();
  }

  private createSvg(): void {
    this.svg = d3.select("figure#performance")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", `translate(${this.margin},${this.margin})`);
  }

  private drawLines(): void {
    this.svg.selectAll('*').remove();  // Clear the previous chart

    // Filter data based on selections
    let filteredData = this.data.filter(d => 
      (this.selectedSubject === 'all' || d.subject === this.selectedSubject) &&
      (this.selectedSemester === 'all' || d.semester === this.selectedSemester)
    );

    // X scale: mapping subjects to points on the X axis
    const x = d3.scalePoint()
      .domain(filteredData.map(d => d.subject))
      .range([0, this.width])
      .padding(0.5);  // Add padding to avoid overlap

    // Y scale: linear scale for percentages
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([this.height, 0]);

    // Define categories for attendance, theory, practice, and evaluation
    const categories: (keyof typeof filteredData[0])[] = ['attendance', 'theory', 'practice', 'evaluation'];

    // Define colors for each category
    const colors: { [key in keyof typeof filteredData[0]]: string } = {
      attendance: 'orange',
      theory: 'green',
      practice: 'blue',
      evaluation: 'purple',
      subject: '',  // This won't be used, added for type completion
      semester: ''  // This won't be used, added for type completion
    };

    // Define the line generator
    const line = d3.line<{ subject: string; value: number }>()
      .x(d => x(d.subject)!)
      .y(d => y(d.value));

    // Create lines for each category
    categories.forEach(category => {
      // Map data for each category
      const mappedData = filteredData.map(d => ({
        subject: d.subject,
        value: d[category] ?? 0  // Fallback to 0 if undefined
      }));

      // Append path for each category
      this.svg.append("path")
        .datum(mappedData)
        .attr("fill", "none")
        .attr("stroke", colors[category])
        .attr("stroke-width", 2)
        .attr("d", line);
    });

    // Add dots on each line
    categories.forEach(category => {
      this.svg.selectAll(`.dot-${category}`)
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("cx", (d: { subject: string; }) => x(d.subject)!)
        .attr("cy", (d: { [x: string]: any; }) => y(d[category] ?? 0))
        .attr("r", 5)
        .attr("fill", colors[category]);
    });

    // Add X axis with label
    this.svg.append("g")
      .attr("transform", `translate(0,${this.height})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", this.width / 2)
      .attr("y", this.margin - 10)
      .attr("text-anchor", "middle")
      .text("Subjects");

    // Add Y axis with label
    this.svg.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("x", -this.margin)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Percentage");

    // Update selected filters display
    d3.select('#selected-filters')
      .text(`Selected: ${this.selectedSubject === 'all' ? 'All Subjects' : this.selectedSubject}, ${this.selectedSemester === 'all' ? 'All Semesters' : this.selectedSemester}`);
  }

  private setupEventListeners(): void {
    // Listen for changes in the subject and semester selectors
    d3.select('#subject').on('change', (event: Event) => {
      this.selectedSubject = (event.target as HTMLSelectElement).value;
      this.drawLines();
    });

    d3.select('#semester').on('change', (event: Event) => {
      this.selectedSemester = (event.target as HTMLSelectElement).value;
      this.drawLines();
    });
  }
}
