import { parse } from 'path';
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

  private setFilePath(
    uploadedFile: Express.Multer.File,
    userId: string,
  ): string {
    const currentFilename = parse(uploadedFile.originalname);
    const newFilename = `${userId}/${Date.now()}${currentFilename.ext}`;
    return `avatar/${newFilename}`;
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
      // 公開ファイルにする
      await file.makePublic();
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async uploadImage(
    uploadedFile: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    const filePath = this.setFilePath(uploadedFile, userId);
    await this.saveImageToStorage(uploadedFile, filePath);
    const STORAGE_URL = process.env.STORAGE_URL;

    return `${STORAGE_URL}/${this.bucket.name}/${filePath}`;
  }
}
