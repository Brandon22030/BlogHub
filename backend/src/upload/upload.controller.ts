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
    } catch (e) {
      return { error: 'Cloudinary upload failed', details: e?.message };
    }
  }
}
