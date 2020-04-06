import { IsNotEmpty, Length } from 'class-validator';

export class RecoverPasswordDto {

  @IsNotEmpty()
  code: string;

  @Length(4, 40)
  passwordNew: string;
}