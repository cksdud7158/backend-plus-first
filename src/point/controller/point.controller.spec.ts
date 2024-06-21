import { Test, TestingModule } from "@nestjs/testing";
import { PointController } from "./point.controller";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../app.module";
import { pointServiceProvider } from "../service/point.service.provider";
import { pointRepositoryProvider } from "../repository/point/point.repository.provider";
import { DatabaseModule } from "../../database/database.module";
import { PointService } from "../service/point.service";
import { IPOINT_SERVICE } from "../service/point.service.interface";
import { PointInputDto, PointOutputDto } from "../dto/point.dto";
import { pointHistoryRepositoryProviders } from "../repository/pointHistory/pointHistory.repository.provider";

describe("PointController", () => {
  let app: INestApplication;
  let pointController: PointController;
  let pointService: PointService;

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
      imports: [AppModule, DatabaseModule],
      controllers: [PointController],
      providers: [
        ...pointServiceProvider,
        ...pointRepositoryProvider,
        ...pointHistoryRepositoryProviders,
      ],
    }).compile();

    pointController = module.get(PointController);
    pointService = module.get(IPOINT_SERVICE);

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true })); // 테스트 환경에서도 ValidationPipe을 전역으로 설정
    await app.init();
  });

  // 포인트 조회 테스트
  describe("/point/:id (get)", () => {
    it("포인트 조회 성공", async () => {
      //given
      const id = 1;
      const data: PointOutputDto = { id, point: 0, updateMillis: Date.now() };

      //when
      jest.spyOn(pointService, "getPoint").mockResolvedValue(data);
      const pointOutputDto = await pointController.point(id);

      //then
      expect(pointOutputDto).toEqual(data);
    });

    // 포인트 조회 실패 시 예외 처리
    it("id 가 숫자가 아닐 경우", async () => {
      return request(app.getHttpServer()).get("/point/invalid").expect(400);
    });

    it("id 가 숫자가 아닐 경우", async () => {
      return request(app.getHttpServer()).get("/point/-1").expect(400);
    });
  });

  // 포인트 충전 테스트
  describe("/point/:id/charge (PATCH)", () => {
    it("포인트를 충전 성공", async () => {
      //given
      const userId = 1;
      const amount = 10;
      const updateMillis = Date.now();
      const pointInputDto: PointInputDto = { amount };
      const pointOutputDto: PointOutputDto = {
        id: userId,
        point: amount,
        updateMillis,
      };

      //when
      jest.spyOn(pointService, "charge").mockResolvedValue(pointOutputDto);
      const res = await pointController.charge(userId, pointInputDto);

      //then
      expect(res).toEqual(pointOutputDto);
    });

    it("userId가 숫자가 아닌 경우 400을 반환", async () => {
      //given
      const userId = "test";
      const amount = 10;
      const pointInputDto: PointInputDto = { amount };

      //when
      const response = await request(app.getHttpServer())
        .patch(`/point/${userId}/charge`)
        .send(pointInputDto);

      //then
      expect(response.status).toBe(400);
    });

    it("userId가 0보다 작은 경우 400을 반환", async () => {
      //given
      const userId = -1;
      const amount = 10;
      const pointInputDto: PointInputDto = { amount };

      //when
      const response = await request(app.getHttpServer())
        .patch(`/point/${userId}/charge`)
        .send(pointInputDto);

      //then
      expect(response.status).toBe(400);
    });

    it("amount가 0보다 작은 경우 400을 반환", async () => {
      //given
      const userId = 1;
      const amount = -1;
      const pointInputDto: PointInputDto = { amount };

      //when
      const response = await request(app.getHttpServer())
        .patch(`/point/${userId}/charge`)
        .send(pointInputDto);

      //then
      expect(response.status).toBe(400);
    });
  });
});
