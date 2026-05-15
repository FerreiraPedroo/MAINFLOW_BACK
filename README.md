### Prisma

- Para instalar o cliente Prisma
  npm install prisma @prisma/client

- Inicia o prisma
  npx prisma init

- Instalando adaptadores (SQLite)
  npm install @prisma/adapter-better-sqlite3 better-sqlite3

- Configurando o schema do prisma.
  Arquivo: schema.prisma

Javascript```
generator client {
provider = "prisma-client"
}

datasource db {
provider = "sqlite"
url = env("DATABASE_URL")
}

````

Arquivo: .env

Javascript```
DATABASE_URL="file:./dev.db"
````

- Para criar o banco de dados
  npx prisma db push

- Para gerar o cliente do Prisma
  npx prisma generate
