//loading environment variables
require("dotenv").config();

//import dependencies
const express = require("express");
const { PrismaClient } = require("@prisma/client");

//pg and adapter-pg is used since both are required now in prisma 7
//we can use accelerateUrl as an alternative but it is paid service by prisma
//so we will opt using native and traditional self hosted db connection
//pg and adapter-pg
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

//import routes
const userRoutes = require("./routes/user_routes");
const personRoutes = require("./routes/person_routes");

//create PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//create adapter and prisma client
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

//creating express app
const app = express();
app.use(express.json());

//make prisma available to routes
app.locals.prisma = prisma;

//use routes
app.use("/", userRoutes);
app.use("/", personRoutes);

//start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});