import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authservice: AuthService,
    ) {}

    @Post('register')
    register(@Body() dto:RegisterDto) {
        return this.authservice.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authservice.login(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: Request & {
        user: {
            userId: string;
            email: string;
        };
    }) {
        return {
            user: req.user,
        };
    }

}
