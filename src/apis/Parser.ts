import path from "path";
import xlsx from "xlsx";

export default class Parser {
  public static jsonToExcel(jsonData: any[]) {
    // Generate worksheet and workbook
    const ws = xlsx.utils.json_to_sheet(jsonData);

    return ws;
  }
}
