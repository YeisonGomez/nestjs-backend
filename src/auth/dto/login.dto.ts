import { Length, IsEmail, IsNumber } from 'class-validator';

export class LoginDto {

    @IsEmail() 
    email: string;
    
    @Length(3, 30) 
    password: string;

}
