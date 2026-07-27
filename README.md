### Prisma

- Para gerar o cliente do Prisma
  npx prisma generate
- Para subir as alterções para o banco de dados
  npx prisma db push
- Para subir as alterações mas RESETAR o banco de dados.
  npx prisma db push --force-reset
- Para zerar as migrações do banco de dados.
  npx prisma migrate reset
- Para gerar as migrações e sincronizar com o mbanco de dados
  npx prisma migrate dev --name "digitar o nome da migração(sem aspas)"

### Docker

- Para baixar o postgres <br/>
  #> docker pull postgres:15.18-trixie <br/>
- Configurar o .env <br/>
  #> DATABASE_URL=postgresql://usuario:senha@host:5432/nome_do_banco <br/>

-  Verifique se a porta foi exposta:Para que o localhost funcione, o contêiner precisa ter sido criado com o parâmetro de porta (ex: -p 5432:5432). Rode o comando abaixo para confirmar: <br/>
  #> docker ps --filter "name=MAINFLOW_POSTGRES"

- Se na coluna PORTS aparecer algo como 0.0.0.0:5432->5432/tcp, está correto.Se a coluna PORTS estiver vazia ou mostrar apenas 5432/tcp (sem o 0.0.0.0: antes), a porta não está aberta para o Windows. <br/> <br/>

- Se a porta NÃO estiver exposta:Você precisará recriar o contêiner abrindo a porta. <br/>
  #> docker stop MAINFLOW_POSTGRES <br/>
  #> docker rm MAINFLOW_POSTGRES <br/>
  #> docker run --name MAINFLOW_POSTGRES -e POSTGRES_PASSWORD=12345678 -e POSTGRES_DB=mainflow -p 5432:5432 -d postgres <br/>
