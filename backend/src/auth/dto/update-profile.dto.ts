import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Imię musi mieć co najmniej 2 znaki' })
  @MaxLength(100, { message: 'Imię nie może być dłuższe niż 100 znaków' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Podaj prawidłowy adres email' })
  email?: string;
}
