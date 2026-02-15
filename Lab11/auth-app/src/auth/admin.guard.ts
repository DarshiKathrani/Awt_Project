import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('🔥 ADMIN GUARD EXECUTED');

    const request = context.switchToHttp().getRequest<Request>();

    console.log('🍪 Cookies:', request.cookies);

    const token = request.cookies?.token;

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    console.log('🧾 JWT Payload:', payload);

    if (payload.role !== 'admin') {
      throw new ForbiddenException('Admin access only');
    }

    return true;
  }
}
