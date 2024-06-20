import { UserPoint } from "../model/point.model";

export class PointDomain implements UserPoint {
  constructor(
    public id: number,
    public point: number,
    public updateMillis: number,
  ) {}
}
