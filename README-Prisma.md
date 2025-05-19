## How To Use Prisma:
1. Install typescript
$ npm install typescript --save-dev

2. Install prisma
$ npm install prisma --save-dev

3. Install SQLITE:
$ npm install sqlite3
src: https://www.robinwieruch.de/next-prisma-sqlite/

4. Init Prisma w/ Sqlite
$ npx prisma init --datasource-provider sqlite

5. Add Prisma Client
$ npm install @prisma/client

then: Next steps:
    1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
        #--Edit .gitignor to Avoid env to show:
        .env*
    2. Run prisma db pull to turn your database schema into a Prisma schema.
        $ npx prisma db push
        OR
        DO that script if want to update the Schema
    3. Run prisma generate to generate the Prisma Client. You can then start querying your database.
        $ npx prisma generate
    4. Tip: Explore how you can extend the ORM with scalable connection pooling, global caching, and real-time database events. Read: https://pris.ly/cli/beyond-orm

6. To see by GUI:
$ npx prisma studio

7. Add "db.ts" inside src/lib (make this folder if not available): To make instansiate PrismaClient that usually error in NextJS
```
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
```


# Prisma with PostgreSQL:
1. Stop Node Serveis
2. add = DATABASE_URL="postgresql:URL" in env file
3. npx prisma generate (Ensure Prisma is install)
4. Run migrations to apply the schema to your Supabase database
    $ npx prisma migrate dev --name init

    Or you can push the schema changes
    $ npx prisma db push