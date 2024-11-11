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
                        for (let row = startRow; row <= endRow; row++) {
                            const rowData = sheetData[row].slice(0, maxCol); // Lấy dữ liệu của dòng trong phạm vi cột tối đa
    
                            // Lặp qua từng ô trong dòng hiện tại để kiểm tra và cộng dồn giá trị
                            rowData.forEach((cell, colIndex) => {
                                const numericValue = parseFloat(cell);
                                if (!isNaN(numericValue)) {
                                    // Cộng dồn giá trị vào columnSums
                                    this.columnSums[colIndex] += numericValue;
    
                                    // Cộng dồn các giá trị thảo luận cần thiết và đã hoàn thành
                                    if (colIndex % 2 === 0) {
                                        totalDiscussionsNeeded += numericValue;
                                    }
                                    if (colIndex % 2 !== 0) { 
                                        totalDiscussionsDone += numericValue;
                                    }
                                }
    
                                
                            }); 
                                
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
    
                        // Thêm dữ liệu báo cáo vào danh sách `reports`
                        this.reports.push(reportData);
                    }
                });
            }
        });
    
        // Gọi hàm `getAllReports` để lấy tất cả báo cáo sau khi xử lý xong
        // this.getAllReports();
        const reports = this.getAllReports();
    console.log("reports" ,reports)
    }
    

}
