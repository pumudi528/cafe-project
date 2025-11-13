// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OrdersService } from './orders/orders.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Optional: allow JSON parsing for large requests
  app.useGlobalPipes();

  // Start the app
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);

  // ----- AUTO-ABANDON JOB -----
  // Get the OrdersService instance
  const ordersService = app.get(OrdersService);

  // Run every minute
  setInterval(async () => {
    try {
      await ordersService.autoAbandon();
      console.log('Auto-abandon job ran at', new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error in auto-abandon job:', err);
    }
  }, 60 * 1000); // 60,000 ms = 1 minute
}

bootstrap();

