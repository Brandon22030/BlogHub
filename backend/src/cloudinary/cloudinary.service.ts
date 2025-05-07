// src/cloudinary/cloudinary.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinaryModule } from 'cloudinary';
import toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private cloudinary: typeof cloudinaryModule,
  ) {}

  uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = this.cloudinary.uploader.upload_stream(
        { folder: 'bloghub' },
        (error: any, result: UploadApiResponse) => {
          if (error)
            return reject(new Error(error?.message || 'Erreur Cloudinary'));
          if (!result)
            return reject(
              new Error('Cloudinary n’a pas retourné de résultat.'),
            );
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteImage(publicId: string): Promise<{ result: string }> {
    return this.cloudinary.uploader.destroy(publicId);
  }
}
