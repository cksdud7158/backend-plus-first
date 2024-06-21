import { PointHistory, TransactionType } from "src/point/model/point.model";

export class PointHistoryOutputDto implements PointHistory {
  amount: number;
  id: number;
  timeMillis: number;
  type: TransactionType;
  userId: number;
}
