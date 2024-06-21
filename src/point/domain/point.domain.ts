import { UserPoint } from "../model/point.model";
import { BadRequestException } from "@nestjs/common";

export class PointDomain implements UserPoint {
  constructor(
    public id: number,
    public point: number,
    public updateMillis: number,
  ) {}

  use(amount: number) {
    if (this.point < amount) {
      throw new BadRequestException("포인트 부족");
    }
    this.point -= amount;
  }
}

export type PointInsertOrUpdateType = Pick<PointDomain, "id" | "point">;
