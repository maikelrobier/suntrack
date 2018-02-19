// @flow

export default {
  email: {
    settings: {
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
    },
    sender: {
      name: 'Suntrack Bot',
      address: 'no-reply.bot.suntrack@gmail.com',
    },
  },
  owm: {
    apiKey: process.env.OWM_API_KEY,
  },
}
