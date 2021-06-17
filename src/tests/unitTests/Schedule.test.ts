import * as dateFns from "date-fns";
import { Schedule } from "../../services/Schedule";

describe("Schedule", () => {
  const formatDate = (d: Date) => {
    return dateFns.formatISO(d, { representation: "date" });
  };
  const isStartOfDay = (d: Date) => {
    return dateFns.startOfDay(d).valueOf() === d.valueOf();
  };

  it("Correctly calculates last occurences", () => {
    const t1 = Schedule.getLastOccurrence({
      firstOccurrence: new Date("2021-01-01"),
      occurrences: 4,
      interval: { type: "DAY", every: 4 },
    });

    expect(formatDate(t1)).toBe("2021-01-13");
    expect(isStartOfDay(t1)).toBe(true);

    const t2 = Schedule.getLastOccurrence({
      firstOccurrence: new Date("2021-01-01"),
      occurrences: 3,
      interval: { type: "WEEK", every: 2 },
    });

    expect(formatDate(t2)).toBe("2021-01-29");
    expect(isStartOfDay(t2)).toBe(true);

    const t3 = Schedule.getLastOccurrence({
      firstOccurrence: new Date("2021-01-01"),
      occurrences: 4,
      interval: { type: "MONTH", every: 2 },
    });

    expect(formatDate(t3)).toBe("2021-07-01");
    expect(isStartOfDay(t3)).toBe(true);

    const t4 = Schedule.getLastOccurrence({
      firstOccurrence: new Date("2021-01-01"),
      occurrences: 10,
      interval: { type: "YEAR", every: 1 },
    });

    expect(formatDate(t4)).toBe("2030-01-01");
    expect(isStartOfDay(t4)).toBe(true);
  });
});
