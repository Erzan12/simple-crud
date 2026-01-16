//loading environment variables
require("dotenv").config();

//import dependencies
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

//import routes
const userRoutes = require("./routes/user_routes");
const personRoutes = require("./routes/person_routes");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//connecting prisma to postgresql
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