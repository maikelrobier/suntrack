// @flow
import nodemailer from 'nodemailer'

const FROM_NAME = 'Suntrack Bot'
const FROM_ADDRESS = 'no-reply.bot.suntrack@gmail.com'

type AccountSettings = {
  user: string,
  password: string,
}

type MailOptions = {
  subject: string,
  text: string,
  to: string,
}

export default class Mailer {
  transporter: any

  constructor({ user, password }: AccountSettings) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass: password,
      }
    })
  }

  async sendMail(mailOptions: MailOptions) {
    const mail = {
      ...mailOptions,
      from: {
        name: FROM_NAME,
        address: FROM_ADDRESS,
      },
    }

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mail, function (error, info) {
        if (error) {
          reject(error)
        } else {
          resolve(info.response)
        }
      })
    })
  }
}
