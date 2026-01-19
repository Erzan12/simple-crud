# Set Up

1. Clone the repository or create your own project directory
git clone
cd simple-crud

2. Install PostgreSQL & pgAdmin

 - Install PostgreSQL 17 (or latest)

 - Install pgAdmin 4

 - Open pgAdmin and register a new server:

    - Host: localhost

    - Port: 5432

    - Maintenance DB: postgres

    - Username: postgres

    - Password: postgres

 - Create a new database named:
   - simplecrud

3. Create Environment Variables
   - Create a .env file in the root directory:
   - DATABASE_URL="postgresql://postgres:postgres@localhost:5432/simplecrud"

# Installing Dependencies (Manual Way)
4. Initialize Node Project
   - npm init -y

5. Install Runtime Dependencies
   - npm install express pg dotenv @prisma/client @prisma/adapter-pg

6. Install Development Dependencies
   - npm install --save-dev prisma nodemon

# Prisma Setup
7. Initialize Prisma
   - npx prisma init

8. Run Database Migration
   - npx prisma migrate dev --name init

9. Generate Prisma Client
   - npx prisma generate

10. View Database with Prisma Studio (optional) 
   - npx prisma studio
      or using config:
   - npx prisma studio --config ./prisma.config.ts

# Running the API Server
   - node index.js
   or(if using nodemon):
   - npx nodemon index.js

   Server runs at:
   - http://localhost:3000

11. crucial detail in schema 
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}