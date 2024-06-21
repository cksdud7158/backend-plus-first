import { Module } from "@nestjs/common";
import { PointController } from "./controller/point.controller";
import { pointServiceProvider } from "./service/point.service.provider";
import { DatabaseModule } from "../database/database.module";
import { pointRepositoryProvider } from "./repository/point/point.repository.provider";
import { pointHistoryRepositoryProviders } from "./repository/pointHistory/pointHistory.repository.provider";

@Module({
  imports: [DatabaseModule],
  controllers: [PointController],
  providers: [
    ...pointServiceProvider,
    ...pointRepositoryProvider,
    ...pointHistoryRepositoryProviders,
  ],
})
export class PointModule {}
