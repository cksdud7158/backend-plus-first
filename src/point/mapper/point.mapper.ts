import { PointDomain } from "../domain/point.domain";
import { PointOutputDto } from "../dto/point.dto";
import { UserPoint } from "../model/point.model";

export class PointMapper {
  static toOutputDto(domain: PointDomain): PointOutputDto {
    return { ...domain };
  }

  static toDomain(entity: UserPoint): PointDomain {
    return new PointDomain(entity.id, entity.point, entity.updateMillis);
  }
}
