const path = require('path')
const EmailTemplate = require('email-templates').EmailTemplate
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

module.exports = async function(envelope) {
  if (!envelope.to || !envelope.subject || !envelope.html || !envelope.text) {
    throw new TypeError('Unexpected envelope')
  }

  const info = await transport.sendMail({
    from: process.env.SMTP_ENVELOPE_FROM,
    ...envelope
  })

  console.log(info.envelope)
  console.log(info.messageId)

  if (process.env.SMTP_TRANSPORT === 'stream') {
    console.log(info.message.toString())
  }

  return info
}
