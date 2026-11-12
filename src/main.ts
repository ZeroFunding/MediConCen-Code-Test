import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Ensure unknown variable will be whitelist filtered
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger API
  const config = new DocumentBuilder()
    .setTitle('Record API')
    .setDescription('The API description for backend code test')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();