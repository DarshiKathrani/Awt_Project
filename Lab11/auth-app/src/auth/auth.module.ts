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
            secret:'4d51a4deae0072bef69f52c4624fb8bafa409c226b859e3dad78cf1d2d89c688eb0bcb42bdb0c694e77b768948f19e5a4257b222ba13d7f5528052abbe8274fc',
            signOptions:{expiresIn:'1h'}

        })
    ],
    controllers:[AuthController],
    providers:[AuthService,DatabaseService,AdminGuard]
})
export class AuthModule{}