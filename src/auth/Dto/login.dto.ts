import { IsString, IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class LoginDto {
  // @IsString()
  // @IsNotEmpty()
  // email: string;

  // @IsString()
  // @IsNotEmpty()
   //@IsNotEmpty()
  // password: string;


  @IsNotEmpty()
  @Matches(/^\d{10}$|^\d{12}$/, {
    message: 'Mobile number must be either 10 or 12 digits',
  })
  mobile: string;
}
export class CompareOtpDto {
  @IsNumber()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}