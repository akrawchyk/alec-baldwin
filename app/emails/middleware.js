const path = require('path')
const EmailTemplate = require('email-templates').EmailTemplate

function renderEmailTemplate(templateName) {
  return async function(ctx, next) {
    const templatesDir = path.resolve(__dirname, '../../templates/emails')
    const template = new EmailTemplate(path.join(templatesDir, templateName))

    // nunjucks config
    const settings = {
      views: path.join(templatesDir, templateName),
    }
    // email config and data
    const locals = {
      settings,
      ...ctx.state.locals,
    }

    ctx.state.rendered = await template.render(locals)

    await next()
  }
}

function htmlEmail() {
  return async function(ctx, next) {
    ctx.body = ctx.state.rendered.html

    await next()
  }
}

module.exports = {
  renderEmailTemplate,
  htmlEmail
}
