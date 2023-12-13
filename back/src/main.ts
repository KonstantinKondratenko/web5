import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Listen the port http://localhost:3001/');
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
    },
  });

  await app.listen(3001);
}
bootstrap();
