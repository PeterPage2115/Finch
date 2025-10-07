import { IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(1, { message: 'Obecne hasło jest wymagane' })
  oldPassword: string;

  @IsString()
  @MinLength(8, { message: 'Nowe hasło musi mieć co najmniej 8 znaków' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Hasło musi zawierać co najmniej jedną małą literę, jedną wielką literę i jedną cyfrę',
  })
  newPassword: string;
}
