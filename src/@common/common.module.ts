import { Module, Global, Inject } from "@nestjs/common";
import { ConfigService } from './config/config.service';
import { CryptoService } from './utils/crypto.service';

@Global()
@Module({
  providers: [
    ConfigService,
    CryptoService
  ],
  exports: [
    ConfigService,
    CryptoService
  ]
})
export class CommonModule { }
