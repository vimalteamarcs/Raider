import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { CompareOtpDto, LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './Entity/user.entity';
import * as crypto from "crypto";
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { UserOtp } from './Entity/userotp.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
    @InjectRepository(UserOtp) private UserOtpRepository: Repository<UserOtp>,
    private jwtService: JwtService, // Inject JwtService to generate JWT tokens
  ) { }

  async register(registerDto: RegisterDto) {

    //const hashedPassword = crypto.createHash("md5").update(registerDto.password).digest("hex");
    const user = this.UserRepository.create({
      ...registerDto,
    //  password: hashedPassword,
    });
    await this.UserRepository.save(user);

    return { message: 'User registered successfully!', status: 200 };
  }



  async login(loginDto: LoginDto) {

    const otp = crypto.randomInt(1000, 9999).toString();

    try {
      let isNew = true;
      const userhasotp = await this.UserOtpRepository.findOne({ where: { mobile: loginDto.mobile } })
      if (userhasotp) {
        userhasotp.otp = otp;
        await this.UserOtpRepository.save(userhasotp);  // Save the updated OTP
        isNew=false;
      }
      else {
        const userOtp = this.UserOtpRepository.create({
          mobile: loginDto.mobile,
          otp: otp,
        });

        await this.UserOtpRepository.save(userOtp);

        const user = this.UserRepository.create({
          mobile: userOtp.mobile,
        });
        await this.UserRepository.save(user);

      }
      return { mobile: loginDto.mobile, status: 200, isNew: isNew };
    } catch (error) {
      console.error('Error saving OTP:', error);
      throw new HttpException('Failed to store OTP', HttpStatus.INTERNAL_SERVER_ERROR);
    }


  }

  async compareOtpAndGenerateToken(compareOtpDto: CompareOtpDto) {
    const { mobile, otp } = compareOtpDto;
    const userOtp = await this.UserOtpRepository.findOne({ where: { mobile: mobile } });


    if (!userOtp) {
      throw new Error("OTP not found for user");
    }


    if (otp !== userOtp.otp) {
      return {
        message: 'OTP is Invalid!',
        status: 400,
        matched: false
      };
    }


    const payload = { mobile };
    // const accessToken = jwt.sign(payload, `${process.env.JWT_SECRET || 'raider'}`, { expiresIn: `${process.env.ACCESSEXPIRESIN || '0.25h'}` });
    // const referenceToken = jwt.sign(payload, `${process.env.JWT_SECRET || 'raider'}`, { expiresIn: `${process.env.REFEXPIRESIN || '1d'}` });
    const accessToken = this.jwtService.sign(payload, { secret: `${process.env.JWT_SECRET || 'raider'}`, expiresIn: `${process.env.ACCESSEXPIRESIN || '0.25h'}` });
    const referenceToken = this.jwtService.sign(payload, { secret: `${process.env.JWT_SECRET || 'raider'}`, expiresIn: `${process.env.REFEXPIRESIN || '1d'}` });



    return {
      message: 'OTP is valid, tokens generated successfully!',
      accessToken,
      referenceToken,
      status: 200,
      matched: true
    };
  }


  async resendOtp(mobile: string) {

    const otp = crypto.randomInt(1000, 9999).toString();

    try {

      const existingOtp = await this.UserOtpRepository.findOne({ where: { mobile } })
      if (existingOtp) {
        existingOtp.otp = otp;
        await this.UserOtpRepository.save(existingOtp);
      } 
      else {

        const userOtp = this.UserOtpRepository.create({
          mobile,
          otp,
        });
        await this.UserOtpRepository.save(userOtp);
      }


      return { message: 'OTP resent successfully!', status: 200 };
    } catch (error) {
      console.error('Error resending OTP:', error);
      throw new Error('Failed to resend OTP');
    }
  }

}
// const user = await this.UserRepository.findOne({ where: { email: loginDto.email, isActive: true } });
// if (!user) {
//   throw new Error("Invalid Email");
// }
// const hashedPassword = crypto.createHash("md5").update(loginDto.password).digest("hex");
// if (hashedPassword !== user.password) {
//   throw new Error("Invalid Password");
// }