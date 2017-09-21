const uuid = require('uuid')
const nodemailer = require('nodemailer')
const wellknown = require('nodemailer-wellknown')

// Prepare nodemailer transport object
let transport

if (process.env.SMTP_TRANSPORT === 'stream') {
  transport = nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
  })
} else {
  transport = nodemailer.createTransport({
    service: process.env.SMTP_TRANSPORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  })
}

async function sendEmail(envelope) {
  const info = await transport.sendMail(envelope)

  console.log(info.envelope)
  console.log(info.messageId)

  if (process.env.SMTP_TRANSPORT === 'stream') {
    console.log(info.message.toString())
  }

  return info
}

module.exports = sendEmail
