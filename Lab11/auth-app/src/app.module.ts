  import { Module } from '@nestjs/common';
  import { AuthModule } from './auth/auth.module';
  import { MeetingsController} from './meetings/meetings.controller';
  import { TypeOrmModule } from '@nestjs/typeorm';

  @Module({
    imports: [AuthModule
      // TypeOrmModule.forRoot({
      //   type: 'mysql',
      //   host: 'mysql-9cda2c3-darshikathrani4-5f8c.e.aivencloud.com',
      //   port: 15262,
      //   username: 'avnadmin',
      //   password: 'AVNS_C9Nl0jeVKQ6hZpcv5xP',
      //   database: 'defaultdb',
      //   ssl: {
      //     rejectUnauthorized: false
      //   },
      //   autoLoadEntities: true,
      //   synchronize: false
      // }),
    ],
    controllers:[MeetingsController]
    
  })
  export class AppModule {}
