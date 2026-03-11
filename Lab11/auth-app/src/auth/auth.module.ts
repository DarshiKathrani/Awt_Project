import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { DatabaseService } from "src/database.service";
import { AdminGuard } from "./admin.guard";

@Module({
    imports:[
        JwtModule.register({
            global:true,
            secret:'process.env.JWT_SECRET',
            signOptions:{expiresIn:'1h'}

        })
    ],
    controllers:[AuthController],
    providers:[AuthService,DatabaseService,AdminGuard]
})
export class AuthModule{}