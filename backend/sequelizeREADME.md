# Sequelize Migrations & Seeders

## Introduction
This document serves as a guide for using Sequelize Migrations and Seeders in our project. It's aimed to provide clarity and assist all team members in effectively utilizing these tools for database management.

## Migrations in Sequelize
A Sequelize Migration is a JavaScript file with two main functions, `up` and `down`. These functions explain how to make database changes and how to undo them. You write what these functions should do, but you don't run them yourself. Instead, they are run automatically by the command line tool. In these functions, you just use commands to manage your database, using Sequelize's features like `sequelize.query`. That's all there is to it – there's no complicated extra stuff involved.

### Creating a Migration file
```bash
npx sequelize-cli migration:generate --name demo-user
```

### Running the migration
```bash
npx sequelize-cli db:migrate
```

### Running a specific migration file, not all
```bash
npx sequelize-cli db:migrate --name name-of-migration-file
```

### Undo the previous migration
It will undo only if the previous migration was executed successfully other older migrations will undo
```bash
npx sequelize-cli db:migrate:undo
```

### Undo a specific migration
```bash
npx sequelize-cli db:migrate:undo --name name-of-migration-file
```

## Seeders
Let's say we need to automatically add certain information to some database tables. For example, in our previous discussion, we talked about adding a demo user to the User table.

To handle this, we can use something called seeders. These are special files that make changes to the data. We use them to fill our database tables with example or test data.

### Creating the Seeder file
```bash
npx sequelize-cli seed:generate --name demo-user
```


### Running all the seeders
```bash
npx sequelize-cli db:seed:all
```

### Undo the above Seed
```bash
npx sequelize-cli db:seed:undo:all
```

### Running a specific Seeder file, not all
```bash
npx sequelize-cli db:seed --seed name-of-seed-file
```

### Undo a specific Seed
```bash
npx sequelize-cli db:seed:undo --seed name-of-seed-file
```

#

For more details, please refer the [Sequelize document](https://sequelize.org/docs/v6/other-topics/migrations/).
