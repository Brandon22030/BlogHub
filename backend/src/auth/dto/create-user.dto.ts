import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail(
    {},
    {
      message: 'Veuillez fournir une adresse email valide',
    },
  )
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'Votre mot de passe doit faire plus de 6 charactère',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Le mot de passe doit contenir au moins une lettre et un chiffre.',
  })
  password: string;

  @IsString({
    message: 'Vous devez fournir un nom valide',
  })
  name: string;

  @IsNotEmpty()
  confirmPassword: string;
}
