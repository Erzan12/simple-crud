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

// app.post("/person", async (req, res) => {
//   try {
//     const person = await prisma.person.create({
//       data: {
//         userId: req.body.userId,
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         dateOfBirth: req.body.dateOfBirth,
//         phoneNumber: req.body.phoneNumber,
//       },
//     });
//     res.status(201).json(person);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

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

app.post("/register", async (req, res) => {
  try {
    const { email, username, person } = req.body;

    if (!person || !person.name ) {
      return res.status(400).json({ error: "Person Name is required" });
    }

    const register = await prisma.user.create({
      data: {
        email,
        username,
        person: {
          create: {
            name: person.name,
            dateOfBirth: person.dateOfBirth ? new Date(person.dateOfBirth) : null,
            age: person.age || null,
            gender: person.gender || null,
            address: person.address || null,
            phoneNumber: person.phoneNumber || null,
          },
        },
      },
      include: { person: true },
    });

    res.status(201).json(register);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

//read all user
app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany({
        include: {
            person: true,
        }
    });
    res.json(users);
});

//read a user
app.get("/users/:id", async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            person: true,
        }
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
});

//update a user
// app.put("/users/:id", async (req, res) => {
//     try {
//         const user = await prisma.user.update({
//             where: {id: Number(req.params.id) },
//             data: req.body,
//         })
//         res.json(user);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });

//update a user (only user fields)
app.put("/users/:id", async (req, res) => {
    try {
        const { email, username } = req.body;

        const updateData = {};
        if (email !== undefined) updateData.email = email;
        if (username !== undefined) updateData.username = username;

        const user = await prisma.user.update({
            where: { id: Number(req.params.id) },
            data: updateData,
            include: {
                person: true,
            }
        });

        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//update person data
app.put("/persons/:userId", async (req, res) => {
    try {
        const { Name, dateOfBirth, age, gender, address, phoneNumber } = req.body;

        const updateData = {};
        if (Name !== undefined) updateData.Name = Name;
        if (dateOfBirth !== undefined) updateData.dateOfBirth = new Date(dateOfBirth);
        if (age !== undefined) updateData.age = age;
        if (gender !== undefined) updateData.gender = gender;
        if (address !== undefined) updateData.address = address;
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

        const person = await prisma.person.update({
            where: { userId: Number(req.params.userId) },
            data: updateData,
        });

        res.json(person);
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

