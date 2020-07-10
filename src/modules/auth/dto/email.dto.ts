import { IsEmail } from 'class-validator';

export class Email {

  @IsEmail()
  email: string;

}