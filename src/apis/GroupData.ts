export default class GroupData {
  public static groupByMonth(records: any[]) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let uniqueMonths: number[] = [];
    let groups: { month: string; records: any[] }[] = [];

    records.forEach((record, idx) => {
      if (!uniqueMonths.includes(record.month)) uniqueMonths.push(record.month);

      const idxOfUniqueMonth = uniqueMonths.indexOf(record.month);

      if (!groups[idxOfUniqueMonth]) {
        const group: { month: string; records: any[] } = {
          month: months[record.month - 1],
          records: [record],
        };
        groups.push(group);
      } else {
        const group = groups[idxOfUniqueMonth];
        const records = group.records;
        records.push(record);

        const updatedGroup: { month: string; records: any[] } = {
          ...group,
          records: [...records],
        };
        groups[idxOfUniqueMonth] = updatedGroup;
      }
    });

    return groups;
  }
}
