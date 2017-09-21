const path = require('path')
const EmailTemplate = require('email-templates').EmailTemplate

async function renderEmailTemplate(templateName, localData) {
  const templatesDir = path.resolve(__dirname, '../../templates/emails')
  const template = new EmailTemplate(path.join(templatesDir, templateName))

  // nunjucks config
  const settings = {
    views: path.join(templatesDir, templateName),
  }
  // email config and data
  const locals = {
    settings,
    ...localData,
  }

  return await template.render(locals)
}

module.exports = {
  renderEmailTemplate
}
