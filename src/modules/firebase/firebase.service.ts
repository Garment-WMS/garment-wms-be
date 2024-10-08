import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

@Injectable()
export class FirebaseService {
  public app: FirebaseApp;
  constructor(private readonly configService: ConfigService) {
    this.app = initializeApp({
      apiKey: this.configService.get<string>('FIREBASE_API_KEY'),
      authDomain: this.configService.get<string>('FIREBASE_AUTH_DOMAIN'),
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: this.configService.get<string>(
        'FIREBASE_MESSAGING_SENDER_ID',
      ),
      appId: this.configService.get<string>('FIREBASE_APP_ID'),
    });
  }

  getFirestoreInstance() {
    return getFirestore(this.app);
  }

  async uploadBufferToStorage(buffer: Buffer, path: string) {
    // Implement the method
    try {
      const storage = getStorage(this.app);
      const storageRef = ref(storage, path);

      const result = await uploadBytes(storageRef, buffer, {
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const downloadURL = await getDownloadURL(result.ref);
      return downloadURL;
    } catch (e) {}
  }
}
