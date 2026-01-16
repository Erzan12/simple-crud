const express = require("express");
const router = express.Router();

//create user
router.post("/users", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const user = await prisma.user.create({
      data: req.body,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//register or create user and  person
router.post("/register", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { email, username, person } = req.body;

    if (!person || !person.name) {
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

//read all users
router.get("/users", async (req, res) => {
  const prisma = req.app.locals.prisma;
  const users = await prisma.user.findMany({
    include: {
      person: true,
    },
  });
  res.json(users);
});

//read a user
router.get("/users/:id", async (req, res) => {
  const prisma = req.app.locals.prisma;
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      person: true,
    },
  });

  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

//update a user only user no person
router.put("/users/:id", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { email, username } = req.body;

    const updateData = {};
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;

    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: updateData,
      include: {
        person: true,
      },
    });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//update user and person data combined
router.put("/user-person/:id", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { email, username, person } = req.body;

    const userUpdateData = {};
    if (email !== undefined) userUpdateData.email = email;
    if (username !== undefined) userUpdateData.username = username;

    //person data is provided build person update
    if (person) {
      const personUpdateData = {};
      if (person.name !== undefined) personUpdateData.name = person.name;
      if (person.dateOfBirth !== undefined) personUpdateData.dateOfBirth = new Date(person.dateOfBirth);
      if (person.age !== undefined) personUpdateData.age = person.age;
      if (person.gender !== undefined) personUpdateData.gender = person.gender;
      if (person.address !== undefined) personUpdateData.address = person.address;
      if (person.phoneNumber !== undefined) personUpdateData.phoneNumber = person.phoneNumber;

      //add person update if there are fields to update
      if (Object.keys(personUpdateData).length > 0) {
        userUpdateData.person = {
          update: personUpdateData,
        };
      }
    }

    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: userUpdateData,
      include: {
        person: true,
      },
    });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;