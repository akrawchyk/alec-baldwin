const path = require('path')
const EmailTemplate = require('email-templates').EmailTemplate
const sendEmail = require('../workers/smtp')

async function renderEmailTemplate(templateName, toSubject, localData) {
  const templatesDir = path.resolve(__dirname, '../../templates/emails')
  const template = new EmailTemplate(path.join(templatesDir, 'transactional'))

  // nunjucks config
  const settings = {
    views: path.join(templatesDir, 'transactional'),
  }
  // email config and data
  const locals = {
    settings,

    ...toSubject,
    ...localData,
  }

  return await template.render(locals)
}

module.exports = {
  renderEmailTemplate
}

    // const transaction = await ctx.db.transaction.create()
    // const transactionId = transaction.get('id')
    // const emailTransaction = await ctx.db.emailTransaction
    //   .create({
    //     transactionId,
    //     emailId: email.id,
    //     data,
    //   })
    //   .then(emailTxn => emailTxn.get({ plain: true }))
    //
    // try {
    //   const emailContent = {
    //     // XXX
    //     intro: body.emailIntro,
    //     body: body.emailBody,
    //     // XXX
    //     permalink: `https://${process.env.SITE_DOMAIN}/emails/show/${emailTransaction.displayHash}`,
    //   }
    //
    //   const envelope = await getEmailEnvelope(
    //     'transactional',
    //     {
    //       to: email.address,
    //       subject: "Today's Swim: RP10",
    //     },
    //     emailContent
    //   )
    //
    //   const attachments = data.map(d => {
    //     return {
    //       filename: d.name,
    //       content: JSON.stringify(d.seconds),
    //       contentType: 'application/octet-stream',
    //     }
    //   })
    //
    //   const result = await sendEmail({ ...envelope, attachments })
    //   transaction.set('status', ctx.db.transaction.STATUSES.PROCESSED)
    // } catch (err) {
    //   console.error(err)
    //   transaction.set('status', ctx.db.transaction.STATUSES.ERRORED)
    // }
    //
    // await transaction.save()
