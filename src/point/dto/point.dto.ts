import { IsNumber, IsPositive } from "class-validator";
import { UserPoint } from "../model/point.model";

export class PointOutputDto implements UserPoint {
  id: number;
  point: number;
  updateMillis: number;
}

export class PointInputDto {
  @IsPositive()
  @IsNumber()
  amount: number;
}
