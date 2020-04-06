import { IsNotEmpty, Length, IsString } from 'class-validator';

export class ChangePasswordDto {

  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  password: string;

}