import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService, // Injects JwtService
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Retrieve all users from the database.
   * @returns Array of users (id, name, email, imageUrl)
   */
  async getUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
      },
    });
    return users;
  }

  /**
   * Retrieve a user by their unique ID.
   * @param userId - The ID of the user to retrieve
   * @returns The user object (id, name, email, imageUrl)
   */
  async getUser({ userId }: { userId: string }) {
    const users = await this.prisma.user.findMany({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
      },
    });
    return users;
  }

  /**
   * Update a user's profile by their ID.
   * Verifies the old password, updates fields, and handles image upload.
   * @param userId - The ID of the user to update
   * @param body - The update payload (userName, email, password, oldPassword)
   * @param image - (Optional) profile image file
   * @returns Updated user info, new JWT token, and a success message
   */
  async updateProfile(userId: string, body: any, image?: Express.Multer.File) {
    if (image) {
      const result = await this.cloudinaryService.uploadImage(image);
      body.imageUrl = result.secure_url;
    }
    // 1. Retrieve the user
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found.');

    // 2. Verify the old password
    if (!body.oldPassword)
      throw new BadRequestException('Old password required.');
    const passwordValid = await bcrypt.compare(body.oldPassword, user.password);
    if (!passwordValid)
      throw new UnauthorizedException('Incorrect old password.');

    // 3. Prepare data to update
    const data: any = {};
    if (body.userName) data.name = body.userName;
    if (body.email) data.email = body.email;
    if (body.password) data.password = await bcrypt.hash(body.password, 10);

    // 4. Handle image if present
    if (body.imageUrl) {
      data.imageUrl = body.imageUrl;
    }

    // Update user in the database
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    // Generate a new token with updated info
    const payload = {
      userId: updatedUser.id,
      userName: updatedUser.name,
      userEmail: updatedUser.email,
      userImage: updatedUser.imageUrl,
    };
    const newToken = this.jwtService.sign(payload);

    return {
      message: 'Profile updated successfully.',
      token: newToken,
      user: payload,
    };
  }

  /**
   * Delete a user by their ID.
   * @param userId - The ID of the user to delete
   * @returns Success message if deleted
   */
  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found.');
    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'User deleted successfully.' };
  }

  /**
   * Change the role of a user by their ID.
   * @param userId - The ID of the user
   * @param newRole - The new role ("USER" or "ADMIN")
   * @returns The updated user object
   */
  async changeUserRole(userId: string, newRole: 'USER' | 'ADMIN') {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found.');
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: { id: true, name: true, email: true, imageUrl: true, role: true },
    });
    return updatedUser;
  }
}
