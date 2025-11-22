import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Crime Alert API')
    .setDescription('API documentation for Crime Alert Backend - Crime reporting and criminal tracking system')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('app', 'Application endpoints')
    .addTag('auth', 'Authentication endpoints')
    .addTag('crime-reports', 'Crime reports management')
    .addTag('wanted-criminals', 'Wanted criminals information')
    .addTag('scraper', 'Scraper endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3001}`);
  console.log(`API prefix: /api`);
  console.log(`Swagger documentation: http://localhost:${process.env.PORT ?? 3001}/api/docs`);
}
bootstrap();
