import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LogUserDto {
  @IsEmail(
    {},
    {
      message: 'Veuillez fournir une adresse email valide',
    },
  )
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'Votre mot de passe doit faire plus de 8 charactère',
  })
  password: string;
}
