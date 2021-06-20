import { TransactionSchedule } from "@prisma/client";

export type TransactionScheduleResponseMappable = TransactionSchedule & {
  Transactions?: { id: string }[];
  Category: { id: string; value: string; icon?: string | null };
};

export type TransactionScheduleResponse = {
  id: string;
  firstOccurrence: number;
  occurrences?: number;
  intervalType: TransactionSchedule["intervalType"];
  intervalLength: number;
  integerAmount: number;
  comment?: string | undefined;
  createdAt: number;
  category: {
    id: string;
    value: string;
    icon?: string;
  };
};

/**
 * The transaction schedule mapper is used to map single or multiple transaction
 * schedule objects into a response that can be sent to the caller.
 */
export class TransactionScheduleMapper {
  static mapTransactionScheduleToResponse(
    schedule: TransactionScheduleResponseMappable
  ): TransactionScheduleResponse;
  static mapTransactionScheduleToResponse(
    schedule: TransactionScheduleResponseMappable[]
  ): TransactionScheduleResponse[];

  /**
   * Maps a single or multiple budgets to a format which is then sent to
   * the user.
   *
   * @param budget Single budget or an array of budgets.
   */
  static mapTransactionScheduleToResponse(
    schedule:
      | TransactionScheduleResponseMappable
      | TransactionScheduleResponseMappable[]
  ): TransactionScheduleResponse | TransactionScheduleResponse[] {
    if (Array.isArray(schedule)) {
      return schedule.map((t) =>
        TransactionScheduleMapper.mapTransactionScheduleToResponse(t)
      );
    } else {
      return {
        id: schedule.id,
        firstOccurrence: schedule.firstOccurrence.getTime(),
        occurrences: schedule.occurrences ?? undefined,
        intervalType: schedule.intervalType,
        intervalLength: schedule.intervalLength,
        comment: schedule.comment ?? undefined,
        integerAmount: schedule.integerAmount,
        createdAt: schedule.createdAt.getTime(),
        category: {
          id: schedule.Category.id,
          value: schedule.Category.value,
          icon: schedule.Category.icon ?? undefined,
        },
      };
    }
  }
}
