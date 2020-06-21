import ConfigService from '../config/config.service';
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

export class Sengrid {

  constructor() {
    sgMail.setApiKey(ConfigService.sendgrid.apiKey);
  }

  sendEmail(to: any, template: any, substitutions: any) {
    console.log('Correo enviado a: ', to);
    
    return new Promise((resolve, reject) => {
      const msg = {
        to,
        from: 'yeisom40@gmail.com',
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

export default new Sengrid();