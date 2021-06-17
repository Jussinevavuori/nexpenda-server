import * as dateFns from "date-fns";
import { Schedule } from "../../services/Schedule";

describe("Schedule", () => {
  const formatDate = (date: Date) => {
    return dateFns.formatISO(date, { representation: "date" });
  };
  const isStartOfDay = (date: Date) => {
    return dateFns.startOfDay(date).valueOf() === date.valueOf();
  };

  it("Correctly calculates last occurences", () => {
    const t1 = Schedule.getLastOccurence({
      firstOccurence: new Date("2021-01-01"),
      occurences: 4,
      interval: { type: "day", every: 4 },
    });

    expect(formatDate(t1)).toBe("2021-01-13");
    expect(isStartOfDay(t1)).toBe(true);

    const t2 = Schedule.getLastOccurence({
      firstOccurence: new Date("2021-01-01"),
      occurences: 3,
      interval: { type: "week", every: 2 },
    });

    expect(formatDate(t2)).toBe("2021-01-29");
    expect(isStartOfDay(t2)).toBe(true);

    const t3 = Schedule.getLastOccurence({
      firstOccurence: new Date("2021-01-01"),
      occurences: 4,
      interval: { type: "month", every: 2 },
    });

    expect(formatDate(t3)).toBe("2021-07-01");
    expect(isStartOfDay(t3)).toBe(true);

    const t4 = Schedule.getLastOccurence({
      firstOccurence: new Date("2021-01-01"),
      occurences: 10,
      interval: { type: "year", every: 1 },
    });

    expect(formatDate(t4)).toBe("2030-01-01");
    expect(isStartOfDay(t4)).toBe(true);
  });
});
