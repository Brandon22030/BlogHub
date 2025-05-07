import { ApiProperty } from '@nestjs/swagger';

export class LoginSuccessResponseDto {
  @ApiProperty({
    description: 'Response message after successful login.',
    example: 'Login successful.',
  })
  message: string;

  @ApiProperty({
    description: 'The unique identifier of the logged-in user.',
    example: 'clq4x2x0x0000xxxxxxxxx', // Vous pouvez mettre un vrai exemple d'ID si vous en avez un
  })
  userId: string;

  @ApiProperty({
    description: 'The name of the logged-in user.',
    example: 'John Doe',
  })
  userName: string;

  @ApiProperty({
    description: 'The email address of the logged-in user.',
    example: 'user@example.com',
  })
  userEmail: string;

  @ApiProperty({
    description: 'The role of the logged-in user.',
    example: 'USER',
    enum: ['USER', 'ADMIN'], // Assurez-vous que cela correspond à vos rôles possibles
  })
  role: string;
}
