import { Bucket, Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CloudStorageService {
  private bucket: Bucket;
  private storage: Storage;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.STORAGE_PROJECT_ID,
      credentials: {
        client_email: process.env.STORAGE_CLIENT_EMAIL,
        private_key: process.env.STORAGE_PRIVATE_KEY,
      },
    });
    this.bucket = this.storage.bucket(process.env.STORAGE_MEDIA_BUCKET);
  }

  private async saveImageToStorage(
    uploadedFile: Express.Multer.File,
    filePath: string,
  ): Promise<void> {
    const file = this.storage.bucket(this.bucket.name).file(filePath);
    try {
      await file.save(uploadedFile.buffer, {
        contentType: uploadedFile.mimetype,
      });
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async uploadImage(
    uploadedFile: Express.Multer.File,
    filePath: string,
  ): Promise<string> {
    await this.saveImageToStorage(uploadedFile, filePath);
    const STORAGE_URL = process.env.STORAGE_URL;

    return `${STORAGE_URL}/${this.bucket.name}/${filePath}`;
  }
}
