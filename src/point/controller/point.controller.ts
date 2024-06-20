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
import { UserIdPipe } from "../pipes/UserId.pipe";
import { PointMapper } from "../mapper/point.mapper";
import { PointDto, PointOutputDto } from "../dto/point.dto";
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
  async point(@Param("id", UserIdPipe) id: number): Promise<PointOutputDto> {
    return PointMapper.toOutputDto(await this.pointService.getPoint(id));
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
   * TODO - 특정 유저의 포인트를 충전하는 기능을 작성해주세요.
   */
  @Patch(":id/charge")
  async charge(
    @Param("id") id,
    @Body(ValidationPipe) pointDto: PointDto,
  ): Promise<UserPoint> {
    const userId = Number.parseInt(id);
    const amount = pointDto.amount;
    return { id: userId, point: amount, updateMillis: Date.now() };
  }

  /**
   * TODO - 특정 유저의 포인트를 사용하는 기능을 작성해주세요.
   */
  @Patch(":id/use")
  async use(
    @Param("id") id,
    @Body(ValidationPipe) pointDto: PointDto,
  ): Promise<UserPoint> {
    const userId = Number.parseInt(id);
    const amount = pointDto.amount;
    return { id: userId, point: amount, updateMillis: Date.now() };
  }
}
