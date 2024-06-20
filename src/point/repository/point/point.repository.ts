import { Injectable } from "@nestjs/common";
import { IPointRepository } from "./point.repository.interface";
import { UserPointTable } from "../../../database/userpoint.table";
import { UserPoint } from "../../model/point.model";

@Injectable()
export class PointRepository implements IPointRepository {
  constructor(private readonly userPointModel: UserPointTable) {}

  async selectById(id: number): Promise<UserPoint> {
    return this.userPointModel.selectById(id);
  }
}
