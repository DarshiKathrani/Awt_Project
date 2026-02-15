import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('meetings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MeetingsController {

  @Post('create')
  @Roles('admin', 'meeting_convener')
  createMeeting() {
    return { message: 'Meeting created' };
  }

  @Get('view')
  @Roles('admin', 'meeting_convener', 'staff')
  viewMeetings() {
    return { message: 'Meetings list' };
  }
}