import { PointInputDto, PointOutputDto } from "../dto/point.dto";

export const IPOINT_SERVICE = "IPointService";

export interface IPointService {
  getPoint(userId: number): Promise<PointOutputDto>;

  charge(userId: number, PointInputDto: PointInputDto): Promise<PointOutputDto>;
}
