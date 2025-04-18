import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('delete')
  async deleteImage(@Body('imageUrl') imageUrl: string) {
    if (!imageUrl) throw new BadRequestException('Image URL is required');
    // Extraire public_id Cloudinary depuis l'URL
    // Ex: https://res.cloudinary.com/demo/image/upload/v1234567890/bloghub/abcde.jpg
    const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?bloghub\/([^.\/]+)\./);
    if (!matches || !matches[1]) {
      throw new BadRequestException('URL Cloudinary invalide');
    }
    const publicId = `bloghub/${matches[1]}`;
    try {
      await this.cloudinaryService.deleteImage(publicId);
      return { success: true };
    } catch (e: any) {
      throw new BadRequestException(
        'Erreur suppression Cloudinary: ' + (e && typeof e === 'object' && 'message' in e ? e.message : ''),
      );
    }
  }
}
