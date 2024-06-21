import { Module, ValidationPipe } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { GlobalExceptionFilter } from "./global-exception.filter";
import { PointModule } from "./point/point.module";

@Module({
  imports: [PointModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter, // 전역 예외 필터를 NestJS에 등록
    },
  ],
})
export class AppModule {}
