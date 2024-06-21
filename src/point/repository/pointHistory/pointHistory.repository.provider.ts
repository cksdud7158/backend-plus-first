import { PointHistoryRepository } from "./pointHistory.repository";
import { IPOINT_HISTORY_REPOSITORY } from "./pointHistory.repository.interface";

export const pointHistoryRepositoryProviders = [
  {
    provide: IPOINT_HISTORY_REPOSITORY,
    useClass: PointHistoryRepository,
  },
];
