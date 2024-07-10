// API to manage everything related to today

export default class Today {
  public static getYear() {
    return new Date(Date.now()).getFullYear();
  }

  public static getMonth() {
    return new Date(Date.now()).getMonth() + 1; // Counting from 1 and not 0
  }

  public static getYearAndMonth() {
    return { year: this.getYear(), month: this.getMonth() };
  }
}
