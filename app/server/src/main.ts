import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const origins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000').split(',').map((s) => s.trim());

  app.setGlobalPrefix('api');
  app.enableCors({ origin: origins, credentials: true });
  // csp отключен, потому что api отдает только json, а swagger ui использует inline-скрипты
  app.use(helmet({ contentSecurityPolicy: false }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));

  const swagger = new DocumentBuilder().setTitle('VetSoft API').setDescription('rest api ветеринарной клиники').setVersion('1.0').addBearerAuth().build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swagger));

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port, '0.0.0.0');
  new Logger('bootstrap').log(`api запущен на порту ${port}, документация: /api/docs`);
}

void bootstrap();
