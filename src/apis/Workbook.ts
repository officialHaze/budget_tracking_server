import xlsx from "xlsx";

export default class Workbook {
  private wb: xlsx.WorkBook = xlsx.utils.book_new();

  public getWbInstance() {
    return this.wb;
  }

  public appendSheet(sheet: xlsx.WorkSheet, sheetName: string) {
    xlsx.utils.book_append_sheet(this.wb, sheet, sheetName);
  }
}
