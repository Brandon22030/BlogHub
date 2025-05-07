import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user.',
    example: 'clx0k2q5j0000u0s0g9q8h3z7',
  })
  userId: string;

  @ApiProperty({
    description: 'The name of the user.',
    example: 'John Doe',
  })
  userName: string;

  @ApiProperty({
    description: 'The email address of the user.',
    example: 'john.doe@example.com',
  })
  userEmail: string;

  @ApiProperty({
    description: 'The role of the user.',
    example: 'USER',
  })
  role: string;
}
