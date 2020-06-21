import { Module, Global, Inject } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ConfigService } from './config/config.service';
import { CryptoService } from './services/crypto.service';

import { permission } from "../entities/users/permission";
import { rol } from "../entities/users/rol";
import { PermissionDatabaseDefault } from "./database/permission.default";
import { RolDatabaseDefault } from "./database/rol.default";
import { LanguageDatabaseDefault } from "./database/language.default";
import { language } from "../entities/users/language";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([permission, rol, language], 'users')
  ],
  providers: [
    ConfigService,
    CryptoService,
    PermissionDatabaseDefault,
    RolDatabaseDefault,
    LanguageDatabaseDefault
  ],
  exports: [
    ConfigService,
    CryptoService
  ]
})
export class CommonModule { }
