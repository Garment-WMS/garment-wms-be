import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [FirebaseService],
  imports: [ConfigModule],
  exports: [FirebaseService],
})
export class FirebaseModule {}
