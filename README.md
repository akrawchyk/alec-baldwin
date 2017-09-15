## Requirements

* Node.js 8.4.0
* NPM 5.4.0
* Postgres 9.6.4

## Development

To start a development server, run:

`npm run dev`

We use [PM2](https://github.com/Unitech/pm2) for process management in development. The configuration is in
`pm2-dev.json`.

## Application


## Database

We use [Sequelize](http://docs.sequelizejs.com/) for an ORM and Postgres for the database.

### Migrations

We also use [sequelize-cli](https://github.com/sequelize/cli/blob/master/docs/README.md) for migrations.
The configuration is located in `db/config.json`.

To migrate your database:

`npm run db:migrate`

To create a new migration:

`npm run migration:generate -- --name <name>`

Rolling back migrations is only supported in development:

`NODE_ENV=development npm run db:migrate:undo:all`

### Models

You can also use the sequelize cli to [generate models](https://github.com/sequelize/cli/blob/master/docs/FAQ.md#how-can-i-generate-a-model) for you:

`npm run model:create -- --name <name> --attributes name:string,state:boolean,birth:date,age:integer`
