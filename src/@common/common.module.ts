import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CryptoService } from './services/crypto.service';
import { SengridService } from "./services/sendgrid.service";

import { Permission } from "../entities/users/permission.entity";
import { Role } from "../entities/users/role.entity";
import { Language } from "../entities/users/language.entity";
import { User } from "../entities/users/user.entity";
import { PermissionDatabaseDefault } from "./database/permission.default";
import { RolDatabaseDefault } from "./database/role.default";
import { LanguageDatabaseDefault } from "./database/language.default";
import { TokenService } from "./services/token.service";
import { UserModule } from "../modules/user/user.module";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Permission, Role, Language], 'users'),
    UserModule
  ],
  providers: [
    CryptoService,
    SengridService,
    TokenService,
    PermissionDatabaseDefault,
    RolDatabaseDefault,
    LanguageDatabaseDefault
  ],
  exports: [
    TokenService,
    CryptoService,
    SengridService
  ]
})
export class CommonModule { }
