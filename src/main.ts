import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { GlobalExceptionFilter } from "./global-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 입력 데이터를 DTO로 변환
      whitelist: true, // DTO에 정의되지 않은 속성은 필터링
    }),
  );
  await app.listen(3000);
}

bootstrap();
