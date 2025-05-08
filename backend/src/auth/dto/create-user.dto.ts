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
  email!: string;

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
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[ \]{};':"\\|,.<>/?-]).*$/,
    {
      message:
        'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial',
    },
  )
  password!: string;

  @ApiProperty({
    description: 'User full name or nickname',
    example: 'John Doe',
  })
  @IsString({
    message: 'Vous devez fournir un nom valide',
  })
  name!: string;

  @ApiProperty({
    description: 'Password confirmation (must match password)',
    example: 'P@ssword123',
  })
  @IsNotEmpty()
  confirmPassword!: string;
}
