import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

const sgMail = require('@sendgrid/mail');

export const Templates = {
  VERIFY_FORGOT_PASSWORD: {
    id: 'd-ef4594eff68349cd9a41572791c46c36',
    subject: { es: 'Recuperar contraseña', en: 'Recover password' }
  },
  SIGNUP_SUCCESS: {
    id: 'd-9e35b5f2cb404bdfa118d9f19ceec2cd',
    subject: { es: 'Registro exitoso', en: 'Signup success' }
  }
};

@Injectable()
export class SengridService {

  private readonly config: any

  constructor(private readonly configService: ConfigService) {
    this.config = configService.get('sendgrid')
    sgMail.setApiKey(this.config.apiKey);
  }

  sendEmail(to: any, template: any, substitutions: any) {
    console.log('Correo enviado a: ', to);
    
    return new Promise((resolve, reject) => {
      const msg = {
        to,
        from: this.config.fromEmail || 'yeisom40@gmail.com',
        templateId: template.id,
        dynamic_template_data: {
          ...substitutions,
          language: { [substitutions.lng]: true },
          subject: template.subject[substitutions.lng]
        }
      }

      sgMail.send(msg).then(async data => {
        if (data[0] && data[0].complete)
          resolve({ success: 'OK', ...data })
        else
          resolve({ success: 'ERROR', ...data })
      }).catch(err => {
        resolve({ error: 'ERROR', ...err })
      });
    })
  }
}
