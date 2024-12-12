# Project : Ruwais Gibol
***************************************************************
NextJS: Build Football Match Update and Statistic


## Notes:
- Started at: Week-1 of Dec24
- Machine: NextJS v.12.1.0
- Web Deploy: vercel.com
- Packages: PWA, Tailwind, Typescript
- Backend: NA
- DB: Supabase
- API: NA

## References:
- https://www.youtube.com/watch?v=dgaAh0Dv0kc
- https://www.youtube.com/watch?v=QXxy8Uv1LnQ&t=195s
- https://krimsonhart.medium.com/how-i-built-my-portfolio-using-next-js-and-sqlite-db-part-2-37595ca4dc40

- Random Images: [https://i.pravatar.cc/200](https://i.pravatar.cc/200)
- Random Images: [https://picsum.photos/200](https://picsum.photos/200)
- Unsplash Images: https://source.unsplash.com/[IMAGE ID]
- Color Ref: [Colors](https://coolors.co/palettes/trending)
- Svg Icon Collection: [SVG Icons](http://svgrepo.com)
- Github Emoji Collection (for Markdown): [Emoji](https://github.com/ikatyang/emoji-cheat-sheet)
- Emoji Collection (for HTML): [Emoji](https://html-css-js.com/html/character-codes/)
- Docs and Diagrams platform for engineering teams: [Eraser.App](https://app.eraser.io/)
- Markdown Editor: [Markdown Editor](https://pandao.github.io/editor.md/index.html)
- Markdown to HTML: [Markdown to HTML](https://markdowntohtml.com)

## Snapshot:
![Ruwais Gibol](public/snapshot/ruwais-gibol.jpg)
<hr>


## How To:
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
