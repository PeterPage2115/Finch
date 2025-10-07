import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Token jest wymagany' })
  token: string;

  @IsString()
  @MinLength(8, { message: 'Hasło musi mieć minimum 8 znaków' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Hasło musi zawierać małą literę, wielką literę i cyfrę',
  })
  newPassword: string;
}
