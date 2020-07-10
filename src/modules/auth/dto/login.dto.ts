import { Length, IsEmail } from 'class-validator';

export class Login {

  @IsEmail()
  email: string;

  @Length(3, 30)
  password: string;

}
