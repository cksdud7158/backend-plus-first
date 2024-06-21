import { IPointHistoryRepository as IPointHistoryRepository } from "./pointHistory.repository.interface";
import { Injectable } from "@nestjs/common";
import { PointHistory } from "../../model/point.model";
import { PointHistoryTable } from "../../../database/pointhistory.table";
import { PointHistoryInsertType } from "../../domain/pointHistory.domain";

@Injectable()
export class PointHistoryRepository implements IPointHistoryRepository {
  constructor(private readonly pointHistoryModel: PointHistoryTable) {}

  async insert(data: PointHistoryInsertType): Promise<PointHistory> {
    return this.pointHistoryModel.insert(
      data.userId,
      data.amount,
      data.type,
      data.timeMillis,
    );
  }

  selectAllByUserId(userId: number): Promise<PointHistory[]> {
    return this.pointHistoryModel.selectAllByUserId(userId);
  }
}
