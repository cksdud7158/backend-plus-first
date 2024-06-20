import { PointOutputDto } from "../dto/point.dto";

export const IPOINT_SERVICE = "IPointService";

export interface IPointService {
  getPoint(userId: number): Promise<PointOutputDto>;
}
