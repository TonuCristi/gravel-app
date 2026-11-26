import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/users.service.js';
import { ACCESS_TOKEN_COOKIE } from '../auth.constants.js';

function readCookie(
  header: string | undefined,
  name: string,
): string | undefined {
  if (!header) return;

  for (const cookie of header.split(';')) {
    const [cookieName, cookieValue] = cookie.trim().split('=');

    if (cookieName === name) {
      return cookieValue;
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const accessToken = readCookie(request.headers.cookie, ACCESS_TOKEN_COOKIE);

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    let payload: { sub: number };
    try {
      payload = await this.jwtService.verifyAsync<{ sub: number }>(accessToken);
    } catch (error) {
      throw new UnauthorizedException();
    }

    const user = this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = user;

    return true;
  }
}
