import { UserPoint } from "src/point/model/point.model";

export const IPOINT_REPOSITORY = "IPointRepository";

export interface IPointRepository {
  selectById(id: number): Promise<UserPoint>;
}
