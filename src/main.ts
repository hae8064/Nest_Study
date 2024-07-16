import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // trasnform을 통해서 dto에 null값인 경우 기본값을 나타나게 하기 위해서
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        // 임의로 변화하는걸 허가
        // class-validation를 기반으로 변환 해 준다.
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
