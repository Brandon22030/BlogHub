import { ApiProperty } from '@nestjs/swagger'; // Ajouté
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    uniqueItems: true,
  })
  @IsEmail(
    {},
    {
      message: 'Veuillez fournir une adresse email valide',
    },
  )
  email: string;

  @ApiProperty({
    description:
      'User password (at least 6 characters, one letter, one number)',
    example: 'P@ssword123',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Votre mot de passe doit faire plus de 6 charactère',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Le mot de passe doit contenir au moins une lettre et un chiffre.',
  })
  password: string;

  @ApiProperty({
    description: 'User full name or nickname',
    example: 'John Doe',
  })
  @IsString({
    message: 'Vous devez fournir un nom valide',
  })
  name: string;

  @ApiProperty({
    description: 'Password confirmation (must match password)',
    example: 'P@ssword123',
  })
  @IsNotEmpty()
  confirmPassword: string;
}
