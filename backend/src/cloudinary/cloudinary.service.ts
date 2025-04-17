// src/cloudinary/cloudinary.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'bloghub' },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary n’a pas retourné de résultat.'));
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }
}
