import { Controller, Post, UnauthorizedException, Body, Inject, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { signup } from './dto/signup';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { EmailDto } from './dto/email.dto';
import Sendgrid, { Templates } from '../@common/utils/sendgrid';

@Controller('auth')
export class AuthController {

  constructor(
    @Inject('CryptoService') private readonly cryptoService,
    @Inject('ConfigService') private readonly configService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }

  @Post('signup')
  async signup(@Body() body: signup) {
    body.email = body.email.toLowerCase()
    body.password = this.cryptoService.encrypt(body.password);
    const response: any = await this.authService.signup(body);

    if (response.error)
      throw new BadRequestException(response);

    await Sendgrid.sendEmail(body.email, Templates.SIGNUP_SUCCESS,
      {
        lng: body.language,
        clientName: body.name + ' ' + body.lastname,
        redirect: this.configService.envConfig.APP_HOST_CLIENT
      })

    return { success: 'OK', payload: this.jwtService.sign({ ...response }) }
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    body.email = body.email.toLowerCase()
    body.password = this.cryptoService.encrypt(body.password);
    let response: any = await this.authService.login(body);

    if (response.error)
      throw new UnauthorizedException(response);

    return { payload: this.jwtService.sign({ ...response }) }
  }

  @Post('request-forgot-password')
  async requestForgotPassword(@Body() body: EmailDto) {
    body.email = body.email.toLowerCase()
    let response: any = await this.authService.requestForgotPassword(body.email);

    if (response.success) {
      const user = response.payload;

      const sendEmail: any = await Sendgrid.sendEmail(body.email, Templates.VERIFY_FORGOT_PASSWORD, {
        lng: user.lng,
        name: user.name,
        lastname: user.lastname,
        redirect: `${this.configService.app.appHostClient}?code=${user.code}`
      })

      if (sendEmail.error)
        return { error: 'ERROR_SEND_EMAIL', detail: 'Ocurrio un problema al enviar el email' }

      return { success: 'OK' }
    } else
      throw new BadRequestException(response);
  }

  @Post('forgot-password')
  async changePassword(@Body() body: ChangePasswordDto) {
    let response: any = await this.authService.changePassword(body);

    if (response.success) {
      return { success: 'OK' }
    } else
      throw new BadRequestException(response);
  }
}
