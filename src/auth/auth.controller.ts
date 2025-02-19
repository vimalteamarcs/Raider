import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { CompareOtpDto, LoginDto } from './dto/login.dto';
import { ApiOperation } from '@nestjs/swagger';


@Controller('auth') // The base route for authentication-related actions
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'login' })
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @ApiOperation({ summary: 'resets OTP by mobile' })
    @Post('resendotp')
    async resendOtp(@Body() mobile: string) {
        try {
            const result = await this.authService.resendOtp(mobile);
            return result;
        } catch (error) {
            return {
                message: error.message,
                status: 400,
            };
        }
    }

    @ApiOperation({ summary: 'verify otp using mobile' })
    @Post('verifyotp')
    async compareOtpAndGenerateToken(@Body() compareOtpDto: CompareOtpDto) {
        try {
            const result = await this.authService.compareOtpAndGenerateToken(compareOtpDto);
            return result;
        } catch (error) {
            return {
                message: error.message,
                status: 400,
            };
        }
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }


}
