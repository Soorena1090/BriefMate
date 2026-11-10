import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ){}

    async register(dto: RegisterDto) {
        const email = dto.email.trim().toLocaleLowerCase();

        const existingUser = await this.usersService.findByEmail(email);

        if(existingUser) {
            throw new ConflictException('Email already exists');
        }

        const passwordHash = await bcrypt.hash(dto.password, 12,);

        const user = await this.usersService.create({
            email,
            passwordHash,
        });

        return {
            message: 'Account created successfully',
            user,
        };
    }

    async login(dto: LoginDto) {
        const email = dto.email.trim().toLocaleLowerCase();

        const user = await this.usersService.findByEmail(email);

        if(!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.passwordHash,
        );

        if(!isPasswordValid) {
            throw new UnauthorizedException('invalid credentials');
        }

        const payload = {
            sub: user.id,
            email: user.email,
        };

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            tokenType: 'Bearer',
        }
    }
}
