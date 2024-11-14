import { Injectable } from '@angular/core';
import { cA } from '@fullcalendar/core/internal-common';
import { AttendanceRecordDay, AttendanceRecordSubject, ReportData } from 'src/app/features/admin-management/model/report/report.model';
import * as XLSX from 'xlsx';
@Injectable({
    providedIn: 'root'
})
export class ReportService {

    private reports: ReportData[] = [];
    private attendanceRecordSubject: AttendanceRecordSubject[] = [];
    private attendanceRecordDay: AttendanceRecordDay[] = [];
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
        // Xóa dữ liệu trong `this.reports` trước khi bắt đầu xử lý mới
        this.reports = [];
    
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
    
            // Lấy thông tin về các ô gộp (merges) trong sheet
            const merges = sheet['!merges'];
            const maxCol = 23; // Số lượng cột tối đa để tính tổng
    
            // Kiểm tra xem có ô gộp nào không
            if (merges && merges.length > 0) {
                // Lặp qua từng ô gộp để tính toán
                merges.forEach((merge, mergeIndex) => {
                    // Xác định phạm vi của ô gộp: dòng bắt đầu, dòng kết thúc, cột bắt đầu
                    const startRow = merge.s.r;
                    const endRow = merge.e.r;
                    const startCol = merge.s.c;
                    let totalDiscussionsNeeded = 0;
                    let totalDiscussionsDone = 0;
    
                    // Chỉ xử lý ô gộp bắt đầu từ cột đầu tiên (cột 0)
                    if (startCol === 0) {
                        // Lấy giá trị của ô gộp đầu tiên trong phạm vi
                        const mergedValue = sheetData[startRow][startCol];
                        this.FCSubject = mergedValue; // Gán giá trị ô gộp cho thuộc tính FCSubject
    
                        // Đặt lại mảng `columnSums` để lưu tổng các cột trong phạm vi ô gộp hiện tại
                        this.columnSums = new Array(maxCol).fill(0);
    
                        // Tính tổng từng cột trong phạm vi ô gộp (dòng từ `startRow` đến `endRow`)
    
                        let index = 0;
                        for (let row = startRow; row <= endRow; row++) {
                            const rowData = sheetData[row].slice(0, maxCol); // Lấy dữ liệu của dòng trong phạm vi cột tối đa
    
                            // Lặp qua từng ô trong dòng hiện tại để kiểm tra và cộng dồn giá trị
                            rowData.forEach((cell, colIndex) => {
                                const numericValue = parseFloat(cell);
                                if (!isNaN(numericValue)) {
                                    // Cộng dồn giá trị vào columnSums (chỉ cộng dòng hiện tại vào cột tương ứng)
                                    this.columnSums[colIndex] = numericValue;
    
                                    // Cộng dồn các giá trị thảo luận cần thiết và đã hoàn thành
                                    if (colIndex % 2 === 0) {
                                        totalDiscussionsNeeded += numericValue;
                                    }
                                    if (colIndex % 2 !== 0 && colIndex != 3 && colIndex != 1) {
                                        totalDiscussionsDone += numericValue;
                                    }
                                }
                            });
    
                            // Tạo đối tượng `attendanceRecordSubject` sau khi xử lý tất cả các ô trong dòng
                            const attendanceRecordSubject: AttendanceRecordSubject = {
                                class: this.Class ?? "không có class",
                                subjectFC: mergedValue ?? 'Chưa có môn học',
                                totalStudents: this.columnSums[1],
                                lateRate: (this.columnSums[4] / this.columnSums[1]) * 100 || 0,
                                absenceRate: (this.columnSums[6] / this.columnSums[1]) * 100 || 0,
                                disciplineRate: (this.columnSums[8] / this.columnSums[1]) * 100 || 0,
                                competencyRate: (this.columnSums[10] / this.columnSums[1]) * 100 || 0,
                                lateSubmissionRate: (this.columnSums[12] / this.columnSums[1]) * 100 || 0,
                                noSubmissionRate: (this.columnSums[14] / this.columnSums[1]) * 100 || 0,
                            };
                            console.log("hihi", attendanceRecordSubject);
                            this.attendanceRecordSubject.push(attendanceRecordSubject);
    
                            const attendanceRecordDay: AttendanceRecordDay = {
                                class: this.Class ?? "không có class",
                                subjectFC: mergedValue ?? 'Chưa có môn học',
                                day: String(this.columnSums[2]),
                                totalStudents: this.columnSums[1],
                                lateRate: (this.columnSums[4] / this.columnSums[1]) * 100 || 0,
                                absenceRate: (this.columnSums[6] / this.columnSums[1]) * 100 || 0,
                                disciplineRate: (this.columnSums[8] / this.columnSums[1]) * 100 || 0,
                                competencyRate: (this.columnSums[10] / this.columnSums[1]) * 100 || 0,
                                lateSubmissionRate: (this.columnSums[12] / this.columnSums[1]) * 100 || 0,
                                noSubmissionRate: (this.columnSums[14] / this.columnSums[1]) * 100 || 0,
                            };
                            this.attendanceRecordDay.push(attendanceRecordDay);
                        }
    
                        // Tạo đối tượng `reportData` chứa thông tin báo cáo
                        const reportData: ReportData = {
                            className: this.Class ?? "không có class",
                            sro: this.Sro ?? 'Chưa có',
                            subject: mergedValue ?? 'Chưa có môn học',
                            teacher: mergedValue ?? 'Chưa có môn học',
    
                            totalStudents: this.columnSums[1],
                            totalDiscussionsNeeded: totalDiscussionsNeeded,
                            totalDiscussionsDone: totalDiscussionsDone,
                            totalLate: this.columnSums[4],
                            totalAwarenessIssues: this.columnSums[7],
                            latePercentage: (this.columnSums[4] / this.columnSums[1]) * 100,
                            awarenessPercentage: (this.columnSums[8] / this.columnSums[1]) * 100,
                            breakdown: {
                                late: { needed: this.columnSums[4], done: this.columnSums[5] },
                                absence: { needed: this.columnSums[6], done: this.columnSums[7] },
                                awareness: { needed: this.columnSums[8], done: this.columnSums[9] },
                                competency: { needed: this.columnSums[10], done: this.columnSums[11] },
                                homework: {
                                    lateSubmission: { needed: this.columnSums[12], done: this.columnSums[13] },
                                    noSubmission: { needed: this.columnSums[14], done: this.columnSums[15] }
                                },
                                retake: {
                                    retest: { needed: this.columnSums[16], done: this.columnSums[17] },
                                    reclass: { needed: this.columnSums[18], done: this.columnSums[19] }
                                },
                                communication: {
                                    parentCommunication: { needed: this.columnSums[20], done: this.columnSums[21] },
                                    ahCommunication: { needed: this.columnSums[22], done: this.columnSums[23] }
                                }
                            },
                        };
    
                        // Thêm dữ liệu báo cáo vào danh sách `reports`
                        this.reports.push(reportData);
                    }
                });
            }
        });
    
        this.getAllReports();
        // const calculateAverageRates = this.calculateAverageRates();
        // console.log(calculateAverageRates);
    }
    
    // Hàm tính trung bình tỷ lệ cho tất cả các môn học trong một lớp
    calculateAverageRates() {
        // Lọc tất cả các bản ghi
        if (this.attendanceRecordSubject.length === 0) {
            return {};
        }
    
        // Nhóm các bản ghi theo lớp và môn học
        const recordsByClassAndSubject: { [className: string]: { [subject: string]: AttendanceRecordSubject[] } } = this.attendanceRecordSubject.reduce((acc, record) => {
            if (!acc[record.class]) {
                acc[record.class] = {};
            }
            if (!acc[record.class][record.subjectFC]) {
                acc[record.class][record.subjectFC] = [];
            }
            acc[record.class][record.subjectFC].push(record);
            return acc;
        }, {} as { [className: string]: { [subject: string]: AttendanceRecordSubject[] } });
    
        // Tính trung bình cho từng lớp và môn học
        const averageRatesByClassAndSubject = Object.keys(recordsByClassAndSubject).reduce((acc, className) => {
            const subjects = recordsByClassAndSubject[className];
            
            acc[className] = Object.keys(subjects).reduce((subjectAcc, subject) => {
                const subjectRecords = subjects[subject];
    
                // Tính tổng các tỷ lệ cho môn học
                const totalRates = subjectRecords.reduce(
                    (sum, record) => {
                        sum.lateRate += record.lateRate;
                        sum.absenceRate += record.absenceRate;
                        sum.disciplineRate += record.disciplineRate;
                        sum.competencyRate += record.competencyRate;
                        sum.lateSubmissionRate += record.lateSubmissionRate;
                        sum.noSubmissionRate += record.noSubmissionRate;
                        return sum;
                    },
                    {
                        lateRate: 0,
                        absenceRate: 0,
                        disciplineRate: 0,
                        competencyRate: 0,
                        lateSubmissionRate: 0,
                        noSubmissionRate: 0,
                    }
                );
    
                // Tính trung bình cho mỗi chỉ số của môn học
                const averageRates = {
                    lateRate: totalRates.lateRate / subjectRecords.length,
                    absenceRate: totalRates.absenceRate / subjectRecords.length,
                    disciplineRate: totalRates.disciplineRate / subjectRecords.length,
                    competencyRate: totalRates.competencyRate / subjectRecords.length,
                    lateSubmissionRate: totalRates.lateSubmissionRate / subjectRecords.length,
                    noSubmissionRate: totalRates.noSubmissionRate / subjectRecords.length,
                };
    
                subjectAcc[subject] = averageRates;
                return subjectAcc;
            }, {} as { [subject: string]: { lateRate: number; absenceRate: number; disciplineRate: number; competencyRate: number; lateSubmissionRate: number; noSubmissionRate: number } });
    
            return acc;
        }, {} as { [className: string]: { [subject: string]: { lateRate: number; absenceRate: number; disciplineRate: number; competencyRate: number; lateSubmissionRate: number; noSubmissionRate: number } } });
    
        return averageRatesByClassAndSubject;
    }
    

groupByClassAndSubject(): { [className: string]: { [subjectName: string]: AttendanceRecordDay[] } } {
    const grouped: { [className: string]: { [subjectName: string]: AttendanceRecordDay[] } } = {};

    // Iterate over all attendance records
    this.attendanceRecordDay.forEach((attendanceRecord, index) => {
      const className = attendanceRecord.class;
      const subjectName = attendanceRecord.subjectFC;

      // Ensure class and subject exist in the grouped structure
      if (!grouped[className]) {
        grouped[className] = {};
      }

      if (!grouped[className][subjectName]) {
        grouped[className][subjectName] = [];
      }

      // Add the session order (using the index as session order, starting from 1)
      const recordWithSessionOrder = { ...attendanceRecord, sessionOrder: index + 1 }; // +1 for 1-based index
      grouped[className][subjectName].push(recordWithSessionOrder);
    });

    return grouped;
  }

}
