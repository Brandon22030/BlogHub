import { ApiProperty } from '@nestjs/swagger';

export class RegisterSuccessResponseDto {
  @ApiProperty({
    description: 'A message confirming successful registration.',
    example:
      'Registration successful. Check your email to activate your account.',
  })
  message: string;
}
