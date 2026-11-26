import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { type RegisterDto } from './dto/register.dto.js';
import { type LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const createdUser = await this.usersService.create(dto);

    const accessToken = await this.jwtService.signAsync({
      sub: createdUser.id,
    });

    return { accessToken, user: createdUser };
  }

  async login(dto: LoginDto) {
    const foundUser = await this.usersService.findByEmail(dto.email);

    if (!foundUser) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      foundUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const accessToken = await this.jwtService.signAsync({ sub: foundUser.id });

    const { password, ...user } = foundUser;

    return { accessToken, user };
  }
}
