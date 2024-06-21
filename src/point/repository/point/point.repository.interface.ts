import { UserPoint } from "src/point/model/point.model";
import { PointInsertOrUpdateType } from "../../domain/point.domain";

export const IPOINT_REPOSITORY = "IPointRepository";

export interface IPointRepository {
  selectById(id: number): Promise<UserPoint>;

  insertOrUpdate(data: PointInsertOrUpdateType): Promise<UserPoint>;
}
