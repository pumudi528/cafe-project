import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OrdersService } from './orders/orders.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );

  
  app.enableCors();

  
  const config = new DocumentBuilder()
    .setTitle('My Orders API')
    .setDescription('API documentation for testing front end')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Customers')
    .addTag('Orders')
    .addTag('Menu') // Add Menu tag so it shows in Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // ----- SERVER START -----
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📘 Swagger Docs: http://localhost:${port}/api-docs`);

  // ----- AUTO-ABANDON JOB FOR ORDERS -----
  const ordersService = app.get(OrdersService);
  setInterval(async () => {
    try {
      await ordersService.autoAbandon();
      console.log('🕒 Auto-abandon job ran at', new Date().toLocaleTimeString());
    } catch (err) {
      console.error('❌ Error in auto-abandon job:', err);
    }
  }, 60 * 1000); // every 1 minute
}

bootstrap();
