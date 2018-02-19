// @flow
import nodemailer from 'nodemailer'

type AccountSettings = {
  user: string,
  password: string,
}

type SenderInfo = {
  name: string,
  address: string,
}

type MailOptions = {
  html?: string,
  subject: string,
  text?: string,
  to: string,
}

export default class Mailer {
  transporter: any
  senderInfo: SenderInfo

  constructor({ user, password }: AccountSettings, senderInfo: SenderInfo) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass: password,
      }
    })
    this.senderInfo = senderInfo
  }

  async sendMail(mailOptions: MailOptions) {
    const mail = {
      ...mailOptions,
      from: this.senderInfo,
    }

    return new Promise((resolve: Function, reject: Function) => {
      this.transporter.sendMail(mail, function (error, info) {
        if (error) {
          return reject(error)
        }

        return resolve(info.response)
      })
    })
  }
}
