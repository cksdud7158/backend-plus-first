import { Inject, Injectable } from "@nestjs/common";
import { UserPoint } from "../model/point.model";
import { IPointService } from "./point.service.interface";
import {
  IPOINT_REPOSITORY,
  IPointRepository,
} from "../repository/point/point.repository.interface";
import { PointMapper } from "../mapper/point.mapper";

@Injectable()
export class PointService implements IPointService {
  constructor(
    @Inject(IPOINT_REPOSITORY)
    private readonly userPointRepository: IPointRepository,
  ) {}

  async getPoint(id: number): Promise<UserPoint> {
    // 사용자 포인트 조회
    const pointEntity = await this.userPointRepository.selectById(id);
    const userPointDomain = PointMapper.toDomain(pointEntity);

    return PointMapper.toOutputDto(userPointDomain);
  }
}
