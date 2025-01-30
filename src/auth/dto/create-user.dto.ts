import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
    message: 'Votre mot de passe doit faire plus de 8 charactère',
  })
  password: string;

  @IsString({
    message: 'Vous devez fournir un nom valide',
  })
  name: string;
}
