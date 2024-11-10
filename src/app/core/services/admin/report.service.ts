import { Injectable } from '@angular/core';
import { ReportData } from 'src/app/features/admin-management/model/report/report.model';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private reports: ReportData[] = [];

  getAllReports(): ReportData[] {
    return this.reports;
  }

  getReportByClassAndSubject(className: string, subject: string): ReportData | undefined {
    return this.reports.find(report => report.className === className && report.subject === subject);
  }

  sheetNames: string[] = [];
  selectedSheetData: any[] = [];
  workbook: XLSX.WorkBook | undefined;
  columnSums: number[] = [];
  acc: string | null = null;
  startRow: number = 0;
  endRow: number = 0;
  startCol: number = 0;

  FCSubject: string | null = null;
  Sro: string | null = null;
  Class: string | null = null;
  SS: number = 0;


processWorkbook(workbook: XLSX.WorkBook) {
    // Duyệt qua tất cả các sheet trong workbook
    Object.keys(workbook.Sheets).forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const sheetData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Kiểm tra nếu sheetData có dữ liệu và lấy Class và Sro từ mỗi sheet
        if (sheetData.length > 1) {
            this.Class = sheetData[0][1];  // Lấy tên lớp từ cột thứ 2 (index 1)
            this.Sro = sheetData[1][1];  // Lấy SRO từ cột thứ 2 (index 1)
        } else {
            console.error(`Không có dữ liệu trong sheet: ${sheetName}`);
            return;
        }

        const merges = sheet['!merges'];
        const maxCol = 24;
        this.columnSums = new Array(maxCol).fill(0);

        if (merges && merges.length > 0) {
            merges.forEach((merge) => {
                this.startRow = merge.s.r;
                this.endRow = merge.e.r;
                this.startCol = merge.s.c;

                // Xử lý ô gộp trong cột đầu tiên (cột 0)
                if (this.startCol === 0) {
                    const mergedValue = sheetData[this.startRow][this.startCol]; 
                    let totalDiscussionsNeeded = 0;
                    let totalDiscussionsDone = 0;
                    // console.log(`Giá trị ô gộp từ dòng ${this.startRow} đến dòng ${this.endRow}:`, mergedValue);

                    if (this.startRow !== -1 && this.endRow !== -1) {
                        // console.log('Tính tổng cho các cột trong phạm vi ô gộp');

                        for (let row = this.startRow; row <= this.endRow; row++) {
                            const rowData = sheetData[row].slice(4, maxCol);

                            rowData.forEach((cell, colIndex) => {
                                const numericValue = parseFloat(cell);
                                if (!isNaN(numericValue)) {
                                    this.columnSums[colIndex] += numericValue;
                            
                                    if (colIndex % 2 === 0) {
                                        totalDiscussionsNeeded += numericValue;
                                    }
                            
                                    if (colIndex % 2 !== 0 ) {
                                        totalDiscussionsDone += numericValue;
                                    }
                                } else {
                                    console.warn(`Skipping non-numeric value at row ${row}, col ${colIndex}:`, cell);
                                }
                            });
                            
                            
                        }

                        let totalClassesHeld = 0;
                        for (let row = this.startRow; row <= this.endRow; row++) {
                            const rowData = sheetData[row];
                            rowData.forEach((cell) => {
                                if (typeof cell === 'number') {
                                    totalClassesHeld += cell;
                                }
                            });
                        }

                        // console.log(`Tổng các giá trị từ dòng ${this.startRow} đến dòng ${this.endRow}:`, totalClassesHeld);

                        // Tạo các đối tượng ReportData cho mỗi ô gộp
                        for (let row = this.startRow; row <= this.endRow; row++) {
                            const reportData: ReportData = {
                                className: this.Class ?? "không có class",
                                sro: this.Sro ?? 'Chưa có',
                                subject: mergedValue ?? 'Chưa có môn học',
                                teacher: mergedValue ?? 'Chưa có môn học',
                                totalStudents: this.columnSums[2],
                                totalDiscussionsNeeded: totalDiscussionsNeeded,
                                totalDiscussionsDone: totalDiscussionsDone,
                                totalClassesHeld: totalClassesHeld,
                                totalLate: this.columnSums[4],
                                totalAwarenessIssues: this.columnSums[7],
                                latePercentage: (this.columnSums[4] / this.columnSums[1]) * 100,
                                awarenessPercentage: (this.columnSums[8] / this.columnSums[1]) * 100,
                                breakdown: { 
                                    late: { done: this.columnSums[4], needed: this.columnSums[5] },
                                    absence: { done: this.columnSums[6], needed: this.columnSums[7] },
                                    awareness: { done: this.columnSums[8], needed: this.columnSums[9] },
                                    competency: { done: this.columnSums[10], needed: this.columnSums[11] },
                                    homework: {
                                        lateSubmission: { done: this.columnSums[12], needed: this.columnSums[13] },
                                        noSubmission: { done: this.columnSums[14], needed: this.columnSums[15] }
                                    },
                                    retake: {
                                        retest: { done: this.columnSums[16], needed: this.columnSums[17] },
                                        reclass: { done: this.columnSums[18], needed: this.columnSums[19] }
                                    },
                                    communication: {
                                        parentCommunication: { done: this.columnSums[20], needed: this.columnSums[21] },
                                        ahCommunication: { done: this.columnSums[22], needed: this.columnSums[23] }
                                    }
                                }
                            };

                            this.reports.push(reportData);
                        }
                    }
                }
            });
        }
    });
    this.getAllReports();
}





}
