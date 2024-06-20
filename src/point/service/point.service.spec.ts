import { Test, TestingModule } from "@nestjs/testing";
import { PointService } from "./point.service";
import { DatabaseModule } from "../../database/database.module";
import {
  IPOINT_REPOSITORY,
  IPointRepository,
} from "../repository/point/point.repository.interface";
import { UserPoint } from "../model/point.model";
import { PointMapper } from "../mapper/point.mapper";
import { PointDomain } from "../domains/point.domain";

describe("PointService", () => {
  let pointService: PointService;
  let pointRepository: jest.Mocked<IPointRepository>;

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
          },
        },
      ],
    }).compile();

    pointService = module.get<PointService>(PointService);
    pointRepository = module.get(IPOINT_REPOSITORY);
  });

  describe("포인트 조회 테스트(getPoint)", () => {
    it("사용자의 포인트 조회 시, 사용자의 포인트가 잘 조회 되는지 테스트", async () => {
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

      const result = await pointService.getPoint(userId);

      expect(result).toEqual(PointMapper.toOutputDto(pointDomain));
    });
  });
});
