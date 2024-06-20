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
import { PointOutputDto } from "../dto/point.dto";

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
      providers: [...pointServiceProvider, ...pointRepositoryProvider],
    }).compile();

    pointController = module.get(PointController);
    pointService = module.get(IPOINT_SERVICE);

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true })); // 테스트 환경에서도 ValidationPipe을 전역으로 설정
    await app.init();
  });

  // 포인트 조회 테스트
  describe("point", () => {
    it("포인트 조회 성공", async () => {
      const id = 1;
      const data: PointOutputDto = { id, point: 0, updateMillis: Date.now() };

      jest.spyOn(pointService, "getPoint").mockResolvedValue(data);
      const pointOutputDto = await pointController.point(id);

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
});
