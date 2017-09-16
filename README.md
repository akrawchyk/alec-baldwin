## Requirements

* Node.js 8.4.x
* NPM 5.4.x
* Postgres 9.6.4

## Development

First, ensure your system meets the application requirements above, and you have
created a database and updated the configuration for it in `pm2-dev.json`.

```
sudo apt-get install postgresql-9.6
nvm install
```

Next, install the application dependencies:

`npm install`

Then migrate your database:

`npm run db:migrate`

And finally, start a development server:

`npm run dev`

We use [PM2](https://github.com/Unitech/pm2) for process management in development. The environment configuration is in `pm2-dev.json`.

## Application

The application is built with the [Koa](http://koajs.com/) web framework.

## Database

We use [Sequelize](http://docs.sequelizejs.com/) for an ORM and Postgres for the database.

### Migrations

We also use [sequelize-cli](https://github.com/sequelize/cli/blob/master/docs/README.md) for migrations. The configuration is located in `db/config.json`.

To migrate your database:

`npm run db:migrate`

To create a new migration:

`npm run migration:generate -- --name <name>`

Rolling back migrations is only supported in development:

`NODE_ENV=development npm run db:migrate:undo:all`

### Models

You can also use the sequelize cli to [generate models](https://github.com/sequelize/cli/blob/master/docs/FAQ.md#how-can-i-generate-a-model) for you:

`npm run model:create -- --name <name> --attributes name:string,state:boolean,birth:date,age:integer`

## Emails

We use [Nodemailer](https://nodemailer.com/about/) with SMTP transport to send emails. Using [nodemailer-wellknown](https://github.com/nodemailer/nodemailer-wellknown), we can
easily support many third-party email services.

### Transports

Emails are sent to console output if `SMTP_TRANSPORT=stream`. This is useful for development purposes.

If you want to send test emails, change the `SMTP_TRANSPORT` configuration in
`pm2-dev.json` to a [supported service](https://nodemailer.com/smtp/well-known/#supported-services), and make sure to provide valid `SMTP_USER` and `SMTP_PASSWORD` configuration for that service.

To change the email address of the sender, update the `SMTP_ENVELOPE_FROM` configuration in `pm2-dev.json`.

### Templates

Templates are rendered with [node-email-templates](https://github.com/niftylettuce/node-email-templates/)
using [Nunjucks](https://mozilla.github.io/nunjucks/) for templating and [node-sass](https://github.com/sass/node-sass) for styling.

We use [Mailgun's transaction email templates](https://github.com/mailgun/transactional-email-templates) as a boilerplate for email templates.
