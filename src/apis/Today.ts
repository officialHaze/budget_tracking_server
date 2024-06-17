// API to manage everything related to today

export default class Today {
  private static date = new Date(Date.now());

  public static getYear() {
    return this.date.getFullYear();
  }

  public static getMonth() {
    return this.date.getMonth() + 1; // Counting from 1 and not 0
  }

  public static getYearAndMonth() {
    return { year: this.getYear(), month: this.getMonth() };
  }
}
