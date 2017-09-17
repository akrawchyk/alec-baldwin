const path = require('path')
const EmailTemplate = require('email-templates').EmailTemplate
const nodemailer = require('nodemailer')
const wellknown = require('nodemailer-wellknown')

module.exports = async function(templateName, envelope, localData) {
  const templatesDir = path.resolve(__dirname, '../templates')
  const template = new EmailTemplate(path.join(templatesDir, 'transactional'))

  // nunjucks config
  const settings = {
    views: path.join(templatesDir, 'transactional')
  }
  // email config and data
  const locals = {
    settings,

    ...envelope,
    ...localData
  }

  // Send a single email
  const rendered = await template.render(locals)

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

  const info = await transport.sendMail({
    from: process.env.SMTP_ENVELOPE_FROM,
    to: locals.to,
    subject: locals.subject,
    html: rendered.html,
    text: rendered.text
  })

  console.log(info.envelope)
  console.log(info.messageId)

  if (process.env.SMTP_TRANSPORT === 'stream') {
    console.log(info.message.toString())
  }

  return info
}
