import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MeetingsController} from './meetings/meetings.controller';


@Module({
  imports: [AuthModule],
  controllers:[MeetingsController]
  
})
export class AppModule {}
