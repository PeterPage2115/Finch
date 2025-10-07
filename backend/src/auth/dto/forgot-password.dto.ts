import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Podaj poprawny adres email' })
  @IsNotEmpty({ message: 'Email jest wymagany' })
  email: string;
}
