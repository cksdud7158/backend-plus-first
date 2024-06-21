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
import { PointHistoryOutputDto } from "../dto/pointHistory.dto";
import { PointHistoryMapper } from "../mapper/pointHistory.mapper";

@Injectable()
export class PointService implements IPointService {
  constructor(
    @Inject(IPOINT_REPOSITORY)
    private readonly pointRepository: IPointRepository,
    @Inject(IPOINT_HISTORY_REPOSITORY)
    private readonly pointHistoryRepository: IPointHistoryRepository,
  ) {}

  async getPoint(userId: number): Promise<UserPoint> {
    // 사용자 포인트 조회
    const pointEntity = await this.pointRepository.selectById(userId);

    if (!pointEntity.id) {
      throw new InternalServerErrorException();
    }

    const userPointDomain = PointMapper.toDomain(pointEntity);

    return PointMapper.toOutputDto(userPointDomain);
  }

  async charge(
    userId: number,
    { amount }: PointInputDto,
  ): Promise<PointOutputDto> {
    // history 추가
    await this.pointHistoryRepository.insert({
      userId,
      amount,
      type: TransactionType.CHARGE,
      timeMillis: Date.now(),
    });

    // 기존 포인트 조회
    let pointEntity = await this.pointRepository.selectById(userId);

    // 기존 유저 없으면 point 0으로 리턴됨
    pointEntity = await this.pointRepository.insertOrUpdate({
      id: userId,
      point: pointEntity.point + amount,
    });

    const userPointDomain = PointMapper.toDomain(pointEntity);
    return PointMapper.toOutputDto(userPointDomain);
  }

  async getHistory(userId: number): Promise<PointHistoryOutputDto[]> {
    // 포인트 이력 조회
    const pointHistoryEntities =
      await this.pointHistoryRepository.selectAllByUserId(userId);

    const pointHistoryDomains = pointHistoryEntities.map((entity) =>
      PointHistoryMapper.toDomain(entity),
    );

    // DTO 변환 후 반환
    return pointHistoryDomains.map((domain) =>
      PointHistoryMapper.toDto(domain),
    );
  }

  async use(userId: number, pointDto: PointInputDto): Promise<PointOutputDto> {
    const amount = pointDto.amount;
    const timeMillis = Date.now();

    // 사용자 기존 포인트 조회
    let pointEntity = await this.pointRepository.selectById(userId);

    // 포인트 사용 처리
    const pointDomain = PointMapper.toDomain(pointEntity);
    pointDomain.use(amount);

    // 포인트 정보 업데이트
    pointEntity = await this.pointRepository.insertOrUpdate(pointDomain);

    // 포인트 이력 저장
    await this.pointHistoryRepository.insert({
      userId,
      amount,
      type: TransactionType.USE,
      timeMillis,
    });

    // DTO 변환 후 반환
    return PointMapper.toOutputDto(PointMapper.toDomain(pointEntity));
  }
}
