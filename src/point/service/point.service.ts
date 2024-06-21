import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { TransactionType, UserPoint } from "../model/point.model";
import { IPointService } from "./point.service.interface";
import {
  IPOINT_REPOSITORY,
  IPointRepository,
} from "../repository/point/point.repository.interface";
import { PointMapper } from "../mapper/point.mapper";
import { PointInputDto, PointOutputDto } from "../dto/point.dto";
import {
  IPOINT_HISTORY_REPOSITORY,
  IPointHistoryRepository,
} from "../repository/pointHistory/pointHistory.repository.interface";

@Injectable()
export class PointService implements IPointService {
  constructor(
    @Inject(IPOINT_REPOSITORY)
    private readonly userPointRepository: IPointRepository,
    @Inject(IPOINT_HISTORY_REPOSITORY)
    private readonly pointHistoryRepository: IPointHistoryRepository,
  ) {}

  async getPoint(id: number): Promise<UserPoint> {
    // 사용자 포인트 조회
    const pointEntity = await this.userPointRepository.selectById(id);

    if (!pointEntity.id) {
      throw new InternalServerErrorException();
    }

    const userPointDomain = PointMapper.toDomain(pointEntity);

    return PointMapper.toOutputDto(userPointDomain);
  }

  async charge(id: number, { amount }: PointInputDto): Promise<PointOutputDto> {
    // history 추가
    const pointHistory = await this.pointHistoryRepository.insert({
      userId: id,
      amount,
      type: TransactionType.CHARGE,
      timeMillis: Date.now(),
    });

    if (!pointHistory || !pointHistory.id) {
      throw new InternalServerErrorException();
    }

    // 기존 포인트 조회
    let pointEntity = await this.userPointRepository.selectById(id);

    if (!pointEntity || !pointEntity.id) {
      throw new InternalServerErrorException();
    }

    // 기존 유저 없으면 point 0으로 리턴됨
    pointEntity = await this.userPointRepository.insertOrUpdate({
      id,
      point: pointEntity.point + amount,
    });

    if (!pointEntity || !pointEntity.id) {
      throw new InternalServerErrorException();
    }

    const userPointDomain = PointMapper.toDomain(pointEntity);
    return PointMapper.toOutputDto(userPointDomain);
  }
}
