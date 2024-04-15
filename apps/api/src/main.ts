import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { appGlobalMiddleware } from './app/useGlobal';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.enableCors({
    origin: [
      /^http:\/\/localhost(:\d+)?$/,
      /^http:\/\/172\.16\.21\.172(:\d+)?$/,
      /^http:\/\/earthworm\.cuixueshe\.com(:81)?$/,
      '*',
    ],
  });

  appGlobalMiddleware(app);
  const config = new DocumentBuilder()
    .setTitle('EarthWorm Swagger')
    .setDescription('The EarthWorm API description')
    .setVersion('v1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);
  await app.listen(3001, '0.0.0.0');
}

bootstrap();
