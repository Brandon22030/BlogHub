import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The password reset token received by email.',
    example: 'someRandomTokenString',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({
    description:
      'The new password for the user. Must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.',
    example: 'P@sswOrd123!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[ \]{};':"\\|,.<>/?-]).*$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  newPassword!: string;

  @ApiProperty({
    description:
      'Confirmation of the new password. Must match the newPassword field.',
    example: 'P@sswOrd123!',
  })
  @IsString()
  @IsNotEmpty()
  confirmNewPassword!: string;
}
