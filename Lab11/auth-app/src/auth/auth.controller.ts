import {
  Post,
  Body,
  Controller,
  Res,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminGuard } from './admin.guard';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response
  ) {
    const { email, password } = body;

    const result = await this.authService.login(email, password);


    res.cookie('token', result.token, {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
  path: '/',
});

    return { message: 'Login successful' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', { path: '/' });
    return { message: 'Logged out successfully' };
  }

  @Post('register')
  @UseGuards(AdminGuard)
  async register(@Body() body: any) {
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      throw new BadRequestException('All fields are required');
    }

    return this.authService.register(name, email, password, role);
  }

  @Post('create-staff')
  @UseGuards(AdminGuard)
  async createStaff(@Body() body: any) {
    const { name, email, password, role, mobile, remarks } = body;

    if (!name || !email || !password || !role) {
      throw new BadRequestException('Required fields missing');
    }

    return this.authService.createStaffWithUser({
      name,
      email,
      password,
      role,
      mobile,
      remarks,
    });
  }
}
