import { TransactionSchedule } from "@prisma/client";

export type TransactionScheduleResponseMappable = TransactionSchedule & {
  Transactions?: { id: string }[];
  Category: { id: string; value: string; icon?: string | null };
};

export type TransactionScheduleResponse = {
  transactionTemplate: {
    integerAmount: number;
    comment?: string | undefined;
    category: {
      id: string;
      value: string;
      icon?: string;
    };
  };
  schedule: {
    id: string;
    firstOccurrence: number;
    occurrences?: number;
    createdAt: number;
    interval: {
      type: TransactionSchedule["intervalType"];
      every: number;
    };
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
        schedule: {
          id: schedule.id,
          firstOccurrence: schedule.firstOccurrence.getTime(),
          occurrences: schedule.occurrences ?? undefined,
          createdAt: schedule.createdAt.getTime(),
          interval: {
            type: schedule.intervalType,
            every: schedule.intervalEvery,
          },
        },
        transactionTemplate: {
          integerAmount: schedule.integerAmount,
          comment: schedule.comment ?? undefined,
          category: {
            id: schedule.Category.id,
            value: schedule.Category.value,
            icon: schedule.Category.icon ?? undefined,
          },
        },
      };
    }
  }
}
