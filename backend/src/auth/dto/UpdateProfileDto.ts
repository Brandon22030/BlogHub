import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({
    message: "Le nom d'utilisateur doit être une chaîne de caractères valide.",
  })
  name?: string;

  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'Veuillez fournir une adresse email valide.',
    },
  )
  email?: string;

  @IsOptional()
  @MinLength(6, {
    message: 'Votre nouveau mot de passe doit faire plus de 6 caractères.',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message:
      'Le nouveau mot de passe doit contenir au moins une lettre et un chiffre.',
  })
  password?: string;

  @IsOptional()
  @IsString() // oldPassword doit être fourni si password est fourni, mais cette logique sera dans le service.
  oldPassword?: string;
}
