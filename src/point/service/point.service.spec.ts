import { Test, TestingModule } from "@nestjs/testing";
import { PointService } from "./point.service";
import { DatabaseModule } from "../../database/database.module";
import {
  IPOINT_REPOSITORY,
  IPointRepository,
} from "../repository/point/point.repository.interface";
import { PointHistory, TransactionType, UserPoint } from "../model/point.model";
import { PointMapper } from "../mapper/point.mapper";
import { PointDomain } from "../domain/point.domain";
import {
  IPOINT_HISTORY_REPOSITORY,
  IPointHistoryRepository,
} from "../repository/pointHistory/pointHistory.repository.interface";
import { PointOutputDto } from "../dto/point.dto";
import { InternalServerErrorException } from "@nestjs/common";

describe("PointService", () => {
  let pointService: PointService;
  let pointRepository: jest.Mocked<IPointRepository>;
  let pointHistoryRepository: jest.Mocked<IPointHistoryRepository>;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

  afterAll(() => {
    // 테스트가 끝난 후 실제 타이머로 복원
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        PointService,
        {
          provide: IPOINT_REPOSITORY,
          useValue: {
            selectById: jest.fn(),
            insertOrUpdate: jest.fn(),
          },
        },
        {
          provide: IPOINT_HISTORY_REPOSITORY,
          useValue: {
            insert: jest.fn(),
          },
        },
      ],
    }).compile();

    pointService = module.get<PointService>(PointService);
    pointRepository = module.get(IPOINT_REPOSITORY);
    pointHistoryRepository = module.get(IPOINT_HISTORY_REPOSITORY);
  });

  describe("포인트 조회 테스트(getPoint)", () => {
    it("사용자의 포인트 조회 시, 사용자의 포인트가 잘 조회 되는지 테스트", async () => {
      //given
      const userId = 1;
      const userPoint: UserPoint = {
        id: 1,
        point: 5,
        updateMillis: Date.now(),
      };
      const pointDomain = new PointDomain(
        userPoint.id,
        userPoint.point,
        userPoint.updateMillis,
      );

      pointRepository.selectById.mockResolvedValueOnce(userPoint);

      //when
      const result = await pointService.getPoint(userId);

      //then
      expect(result).toEqual(PointMapper.toOutputDto(pointDomain));
    });
  });

  describe("포인트 충전 테스트(charge)", () => {
    it("기존 충전되어 있는 포인트가 없을 때 새로 포인트가 잘 충전되는지 테스트", async () => {
      // given
      const userId = 1;
      const amount = 10;
      const updateMillis = Date.now();

      const pointHistory: PointHistory = {
        id: 1,
        userId,
        amount,
        type: TransactionType.CHARGE,
        timeMillis: updateMillis,
      };

      const userPoint: UserPoint = {
        id: 1,
        point: amount,
        updateMillis: updateMillis,
      };

      const userZeroPoint: UserPoint = { ...userPoint, point: 0 };

      const pointOutputDto: PointOutputDto = {
        id: userId,
        point: amount,
        updateMillis,
      };
      pointHistoryRepository.insert.mockResolvedValueOnce(pointHistory);
      pointRepository.selectById.mockResolvedValueOnce(userZeroPoint);
      pointRepository.insertOrUpdate.mockResolvedValueOnce(userPoint);

      // when
      const result = await pointService.charge(userId, { amount });

      // then
      expect(result).toEqual(pointOutputDto);
    });

    it("충전되어 있는 포인트가 있을 때 충전 성공 테스트", async () => {
      // given
      const userId = 1;
      const amount = 10;
      const updateMillis = Date.now();

      const pointHistory: PointHistory = {
        id: 1,
        userId,
        amount,
        type: TransactionType.CHARGE,
        timeMillis: updateMillis,
      };

      const userPoint: UserPoint = {
        id: 1,
        point: amount,
        updateMillis: updateMillis,
      };

      const userOriginPoint: UserPoint = { ...userPoint, point: 100 };

      const pointOutputDto: PointOutputDto = {
        id: userId,
        point: amount,
        updateMillis,
      };

      pointHistoryRepository.insert.mockResolvedValueOnce(pointHistory);
      pointRepository.selectById.mockResolvedValueOnce(userOriginPoint);
      pointRepository.insertOrUpdate.mockResolvedValueOnce(userPoint);

      // when
      const result = await pointService.charge(userId, { amount });

      // then
      expect(result).toEqual(pointOutputDto);
    });

    it("history 저장 실패 시 500 반환", async () => {
      const userId = 1;
      const amount = 10;
      pointHistoryRepository.insert.mockResolvedValueOnce(null);

      await expect(pointService.charge(userId, { amount })).rejects.toEqual(
        new InternalServerErrorException(),
      );
    });

    it("기존 포인트 조회 실패 시 500 반환", async () => {
      const userId = 1;
      const amount = 10;
      const updateMillis = Date.now();

      const pointHistory: PointHistory = {
        id: 1,
        userId,
        amount,
        type: TransactionType.CHARGE,
        timeMillis: updateMillis,
      };
      pointHistoryRepository.insert.mockResolvedValueOnce(pointHistory);
      pointRepository.selectById.mockResolvedValueOnce(null);

      await expect(pointService.charge(userId, { amount })).rejects.toEqual(
        new InternalServerErrorException(),
      );
    });

    it("포인트 충전 실패 시 500 반환", async () => {
      const userId = 1;
      const amount = 10;
      const updateMillis = Date.now();

      const pointHistory: PointHistory = {
        id: 1,
        userId,
        amount,
        type: TransactionType.CHARGE,
        timeMillis: updateMillis,
      };

      const userPoint: UserPoint = {
        id: 1,
        point: amount,
        updateMillis: updateMillis,
      };

      const userOriginPoint: UserPoint = { ...userPoint, point: 100 };

      pointHistoryRepository.insert.mockResolvedValueOnce(pointHistory);
      pointRepository.selectById.mockResolvedValueOnce(userOriginPoint);
      pointRepository.insertOrUpdate.mockResolvedValueOnce(null);

      await expect(pointService.charge(userId, { amount })).rejects.toEqual(
        new InternalServerErrorException(),
      );
    });
  });
});
