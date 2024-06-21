import { PointInputDto, PointOutputDto } from "../dto/point.dto";
import { PointHistoryOutputDto } from "../dto/pointHistory.dto";

export const IPOINT_SERVICE = "IPointService";

export interface IPointService {
  getPoint(userId: number): Promise<PointOutputDto>;

  charge(userId: number, PointInputDto: PointInputDto): Promise<PointOutputDto>;

  getHistory(userId: number): Promise<PointHistoryOutputDto[]>;
}
