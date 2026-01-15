# simple-crud

1. first create .env file use this credential
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/simplecrud"
2. next run "npm install" to install required dependencies
3. run migrations "npx prisma migrate dev --name init"
4. next run "npx prisma generate" to generate prisma client

Set up PgAdmin and postgres
1. install first postgres 17 or latest version
2. install pgadmin4 to add server for database
3. add new database use "PostgreSQL 17" 
   add host name "localhost"
   add port "5432"
   add maintenance port "postgres"
   add username "postgres"
   add password "postgres"

To access endpoints use Postman app

To run Simple CRUD API
run "node index.js"

To view DB table and properties
npx prisma studio --url "postgresql://postgres:postgres@localhost:5432/simplecrud"
or
npx prisma studio --config ./prisma.config.ts
