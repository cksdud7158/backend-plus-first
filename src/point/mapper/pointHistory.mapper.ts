import { Injectable } from "@nestjs/common";
import { PointHistory } from "../model/point.model";
import { PointHistoryDomain } from "../domain/pointHistory.domain";
import { PointHistoryOutputDto } from "../dto/pointHistory.dto";

@Injectable()
export class PointHistoryMapper {
  static toDomain(entity: PointHistory): PointHistoryDomain {
    return new PointHistoryDomain(
      entity.id,
      entity.userId,
      entity.amount,
      entity.type,
      entity.timeMillis,
    );
  }

  static toDto(domain: PointHistoryDomain): PointHistoryOutputDto {
    return {
      id: domain.id,
      userId: domain.userId,
      amount: domain.amount,
      type: domain.type,
      timeMillis: domain.timeMillis,
    };
  }
}
