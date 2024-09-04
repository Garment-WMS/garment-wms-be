import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  imports: [FirebaseModule],
  exports: [ImageService],
})
export class ImageModule {}
