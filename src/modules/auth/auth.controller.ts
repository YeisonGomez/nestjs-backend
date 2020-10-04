import { 
  Controller, 
  Post, 
  UnauthorizedException, 
  Body, 
  Inject, 
  BadRequestException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Templates, SengridService } from '../../@common/services/sendgrid.service';
import { SignUpService } from './services/signup.service';
import { LoginService } from './services/login.service';
import { RecoverPasswordService } from './services/recoverPassword.service';
import { SignupDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { EmailDTO } from './dto/email.dto';
import { ChangePasswordDTO } from './dto/changePassword.dto';
import { ResponseError, ResponseSuccess } from '../../@common/interfaces/response';

@Controller('auth')
export class AuthController {

  constructor(
    @Inject('CryptoService') private readonly cryptoService,
    private readonly sendgridService: SengridService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly signupService: SignUpService,
    private readonly loginService: LoginService,
    private readonly recoverPasswordService: RecoverPasswordService
  ) { }

  @Post('/signup')
  async signup(@Body() body: SignupDTO): Promise<ResponseSuccess | ResponseError> {
    body.email = body.email.toLowerCase()
    body.password = this.cryptoService.encrypt(body.password);
    const response: any = await this.signupService.signup(body);

    if (response.error)
      throw new BadRequestException(response);

    await this.sendgridService.sendEmail(body.email, Templates.SIGNUP_SUCCESS,
      {
        lng: body.language,
        clientName: body.name + ' ' + body.lastname,
        redirect: this.configService.get('app.appHostClient')
      })

    return { success: 'OK', payload: await this.jwtService.sign({ ...response }) }
  }

  @Post('/login')
  async login(@Body() body: LoginDTO): Promise<ResponseSuccess | ResponseError> {
    body.email = body.email.toLowerCase()
    body.password = this.cryptoService.encrypt(body.password);
    const response: any = await this.loginService.login(body);

    if (response.error)
      throw new UnauthorizedException(response);

    return { success: 'OK', payload: await this.jwtService.sign({ ...response }) }
  }

  @Post('/request-forgot-password')
  async requestForgotPassword(@Body() body: EmailDTO): Promise<ResponseSuccess | ResponseError> {
    body.email = body.email.toLowerCase()
    const response: any = await this.recoverPasswordService.requestForgotPassword(body.email);

    if (response.success) {
      const user = response.payload;

      const sendEmail: any = await this.sendgridService.sendEmail(body.email, Templates.VERIFY_FORGOT_PASSWORD, {
        lng: user.lng,
        name: user.name,
        lastname: user.lastname,
        redirect: `${this.configService.get('app.appHostClient')}?code=${user.code}`
      })

      if (sendEmail.error)
        return { error: 'ERROR_SEND_EMAIL', message: 'Ocurrio un problema al enviar el email' }

      return { success: 'OK' }
    } else
      throw new BadRequestException(response);
  }

  @Post('/forgot-password')
  async changePassword(@Body() body: ChangePasswordDTO): Promise<ResponseSuccess | ResponseError> {
    const response: any = await this.recoverPasswordService.changePassword(body);

    if (response.success) {
      return { success: 'OK' }
    } else
      throw new BadRequestException(response);
  }
}
