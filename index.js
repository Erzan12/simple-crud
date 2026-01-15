//loading environtment variables
require("dotenv").config();

//import dependencies
const express = require("express"); //http or web server 
const { PrismaClient } = require("@prisma/client"); //prisma orm client
const { Pool } = require("pg"); //postgreslq connection pool
const { PrismaPg } = require("@prisma/adapter-pg"); //prisma adapter that tells prisma to use pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//connecting prisma to postgre sql
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

//creating express app
const app = express();
app.use(express.json());

//start server
app.listen(3000, () => {
    //return log to see if port 3000 is running successfully
  console.log("Server running on http://localhost:3000");
});

//create user
app.post("/users", async (req,res) => {
    try {
        const user = await prisma.user.create({
            data:req.body,
        });
        res.status(201).json(user);
    }catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//read all user
app.get("/users", async (req,res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

//read a user
app.get("/users/:id", async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {id: Number(req.params.id) },
    });

    if(!user) return res.status(404).json({error:"User not found"});
    res.json(user);
})

//update a user
app.put("/users/:id", async (req, res) => {
    try {
        const user = await prisma.user.update({
            where: {id: Number(req.params.id) },
            data: req.body,
        })
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//delete a user
app.delete("/users/:id", async (req, res) => {
    try {
        await prisma.user.delete({
            where: { id: Number(req.params.id) },
        });
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});