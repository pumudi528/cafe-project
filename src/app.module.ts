import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/cafe'), // MongoDB connection
    AuthModule,
    MenuModule, // ✅ make sure this is included
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}