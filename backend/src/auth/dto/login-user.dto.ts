import { ApiProperty } from '@nestjs/swagger'; // Ajouté
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LogUserDto {
  @ApiProperty({
    description: 'User email address for login',
    example: 'user@example.com',
  })
  @IsEmail(
    {},
    {
      message: 'Veuillez fournir une adresse email valide',
    },
  )
  email: string;

  @ApiProperty({
    description: 'User password for login (at least 6 characters)',
    example: 'P@ssword123',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Votre mot de passe doit faire plus de 8 charactère',
  })
  password: string;
}
