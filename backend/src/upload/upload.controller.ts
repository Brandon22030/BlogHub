import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    try {
      const result = await this.cloudinaryService.uploadImage(file);
      return { url: result.secure_url };
    } catch (e: unknown) {
      let details = 'An unknown error occurred during upload.';
      if (e instanceof Error) {
        details = e.message;
      } else if (typeof e === 'string') {
        details = e;
      } else if (
        e &&
        typeof e === 'object' &&
        'message' in e &&
        typeof e.message === 'string'
      ) {
        details = e.message; // Handle cases where e is an object with a message property
      }
      return { error: 'Cloudinary upload failed', details };
    }
  }
}
