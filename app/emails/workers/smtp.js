const path = require('path')
const EmailTemplate = require('email-templates').EmailTemplate
const nodemailer = require('nodemailer')
const wellknown = require('nodemailer-wellknown')

module.exports = async function() {
  const templatesDir = path.resolve(__dirname, '../templates')
  const template = new EmailTemplate(path.join(templatesDir, 'transactional'))

  // nunjucks config
  const settings = {
    views: path.join(templatesDir, 'transactional')
  }
  // An example users object with formatted email function
  const locals = {
    settings,

    email: 'akrawchyk@gmail.com',
    title: 'Test email',
    intro: 'This is your test email!',
    body: 'Check out this sweet body content!',
    outro: 'And even an outro!',
    postscript: ''
  }

  // Send a single email
  const rendered = await template.render(locals)

  let transport

  if (process.env.SMTP_TRANSPORT === 'stream') {
    transport = nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    })

    const info = await transport.sendMail({
      from: process.env.SMTP_ENVELOPE_FROM,
      to: locals.email,
      subject: locals.title,
      html: rendered.html,
      text: rendered.text
    })

    console.log(info.envelope)
    console.log(info.messageId)
    console.log(info.message.toString())

    return info
  } else {
    // Prepare nodemailer transport object
    transport = nodemailer.createTransport({
      service: process.env.SMTP_TRANSPORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })

    const responseStatus = await transport.sendMail({
      from: process.env.SMTP_ENVELOPE_FROM,
      to: locals.email,
      subject: locals.title,
      html: rendered.html,
      text: rendered.text
    })

    console.log(responseStatus)

    return responseStatus
  }
}
