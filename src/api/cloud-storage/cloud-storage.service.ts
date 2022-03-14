import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudStorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.FIREBASE_PROJECT_ID,
      credentials: {
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
      },
    });
    this.bucket = process.env.STORAGE_MEDIA_BUCKET;
  }

  // private setDestination(destination: string): string {
  //   let escDestination = '';
  //   escDestination += destination
  //     .replace(/^\.+/g, '')
  //     .replace(/^\/+|\/+$/g, '');
  //   if (escDestination !== '') escDestination = escDestination + '/';
  //   return escDestination;
  // }

  // private setFilename(uploadedFile: File): string {
  //   const fileName = parse(uploadedFile.originalname);
  //   return `${fileName.name}-${Date.now()}${fileName.ext}`
  //     .replace(/^\.+/g, '')
  //     .replace(/^\/+/g, '')
  //     .replace(/\r|\n/g, '_');
  // }

  // async uploadFile(uploadedFile: File, destination: string): Promise<any> {
  //   const fileName =
  //     this.setDestination(destination) + this.setFilename(uploadedFile);
  //   const file = this.bucket.file(fileName);
  //   try {
  //     await file.save(uploadedFile.buffer, {
  //       contentType: uploadedFile.mimetype,
  //     });
  //   } catch (error) {
  //     throw new BadRequestException(error?.message);
  //   }
  //   return {
  //     ...file.metadata,
  //     publicUrl: `https://storage.googleapis.com/${this.bucket.name}/${file.name}`,
  //   };
  // }
}
