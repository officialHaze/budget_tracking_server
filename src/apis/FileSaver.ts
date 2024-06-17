import path from "path";
import xlsx from "xlsx";

export default class FileSaver {
  private static defaultPath = path.join(__dirname, "../../public/temp");

  public static getDefaultPath() {
    return this.defaultPath;
  }

  public static saveExcel(wb: xlsx.WorkBook, filename: string) {
    const filepath = this.defaultPath + "/" + filename;

    xlsx.writeFile(wb, filepath);
  }
}
