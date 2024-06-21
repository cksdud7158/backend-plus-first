import { PointHistory, TransactionType } from "../model/point.model";

export class PointHistoryDomain implements PointHistory {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly amount: number,
    public readonly type: TransactionType,
    public readonly timeMillis: number,
  ) {}
}

export type PointHistoryInsertType = Omit<PointHistoryDomain, "id">;
