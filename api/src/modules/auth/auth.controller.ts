import {
  Body,
  Controller,
  Cookies,
  type CookiesOptions,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { type RegisterDto, registerSchema } from './dto/register.dto.js';
import { type LoginDto, loginSchema } from './dto/login.dto.js';
import { HttpAdapterHost } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { type User } from '../../generated/prisma/client.js';
import { ACCESS_TOKEN_COOKIE, cookieOptions } from './auth.constants.js';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  @Post('register')
  async register(
    @Body({ schema: registerSchema }) dto: RegisterDto,
    @Res({ passthrough: true }) res: unknown,
  ) {
    const { accessToken, user } = await this.authService.register(dto);

    this.setAuthCookie(res, accessToken);

    return { user };
  }

  @Post('login')
  async login(
    @Body({ schema: loginSchema }) dto: LoginDto,
    @Res({ passthrough: true }) res: unknown,
  ) {
    const { accessToken, user } = await this.authService.login(dto);

    this.setAuthCookie(res, accessToken);

    return { user };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: User) {
    return { user };
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: unknown) {
    const { maxAge, ...clearCookieOptions } = cookieOptions;

    this.adapterHost.httpAdapter.clearCookie(
      res,
      ACCESS_TOKEN_COOKIE,
      clearCookieOptions,
    );
  }

  private setAuthCookie(res: unknown, accessToken: string) {
    this.adapterHost.httpAdapter.setCookie(
      res,
      ACCESS_TOKEN_COOKIE,
      accessToken,
      cookieOptions,
    );
  }
}
