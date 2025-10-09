import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Enter valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
