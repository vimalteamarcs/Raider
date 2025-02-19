import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation for my application')
    .setVersion('1.0')
    .addBearerAuth() 
    .addApiKey(
      { type: 'apiKey', in: 'header', name: 'x-api-key' },
      'API_KEY',  
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const res = await app.listen(process.env.PORT ?? 3000);
  console.log(`Server is running on ${res.address().port}`);
}
bootstrap();
