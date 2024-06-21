import { PointHistory } from "../../model/point.model";
import { PointHistoryInsertType } from "../../domain/pointHistory.domain";

export const IPOINT_HISTORY_REPOSITORY = "IPointHistoryRepository";

export interface IPointHistoryRepository {
  insert(data: PointHistoryInsertType): Promise<PointHistory>;

  selectAllByUserId(userId: number): Promise<PointHistory[]>;
}
