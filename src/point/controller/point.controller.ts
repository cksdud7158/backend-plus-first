import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  ValidationPipe,
} from "@nestjs/common";
import { PointHistory, UserPoint } from "../model/point.model";
import { IdPipe } from "../pipes/UserId.pipe";
import { PointInputDto, PointOutputDto } from "../dto/point.dto";
import {
  IPOINT_SERVICE,
  IPointService,
} from "../service/point.service.interface";

@Controller("/point")
export class PointController {
  constructor(
    @Inject(IPOINT_SERVICE) private readonly pointService: IPointService,
  ) {}

  /**
   * TODO - 특정 유저의 포인트를 조회하는 기능을 작성해주세요.
   */
  /**
   * @description 사용자 포인트 조회
   * @param id 포인트를 조회할 사용자 ID
   * @returns 사용자의 현재 포인트
   */
  @Get(":id")
  async point(@Param("id", IdPipe) id: number): Promise<PointOutputDto> {
    return await this.pointService.getPoint(id);
  }

  /**
   * TODO - 특정 유저의 포인트를 충전하는 기능을 작성해주세요.
   */
  /**
   * @description 사용자 포인트 충전
   * @param id  사용자 ID
   * @param pointInputDto 충전할 금액
   * @returns 사용자 현재 포인트
   */
  @Patch(":id/charge")
  async charge(
    @Param("id", IdPipe) id: number,
    @Body(ValidationPipe) pointInputDto: PointInputDto,
  ): Promise<PointOutputDto> {
    return await this.pointService.charge(id, pointInputDto);
  }

  /**
   * TODO - 특정 유저의 포인트 충전/이용 내역을 조회하는 기능을 작성해주세요.
   */
  @Get(":id/histories")
  async history(@Param("id") id): Promise<PointHistory[]> {
    const userId = Number.parseInt(id);
    return [];
  }

  /**
   * TODO - 특정 유저의 포인트를 사용하는 기능을 작성해주세요.
   */
  @Patch(":id/use")
  async use(
    @Param("id") id,
    @Body(ValidationPipe) PointInputDto: PointInputDto,
  ): Promise<UserPoint> {
    const userId = Number.parseInt(id);
    const amount = PointInputDto.amount;
    return { id: userId, point: amount, updateMillis: Date.now() };
  }
}
