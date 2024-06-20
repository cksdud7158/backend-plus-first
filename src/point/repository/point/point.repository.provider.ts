import { PointRepository } from "./point.repository";
import { IPOINT_REPOSITORY } from "./point.repository.interface";

export const pointRepositoryProvider = [
  {
    provide: IPOINT_REPOSITORY,
    useClass: PointRepository,
  },
];
