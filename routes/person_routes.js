const express = require("express");
const router = express.Router();

//update person data
router.put("/persons/:userId", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const { name, dateOfBirth, age, gender, address, phoneNumber } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
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

//get person by userId
router.get("/persons/:userId", async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const person = await prisma.person.findUnique({
      where: { userId: Number(req.params.userId) },
    });

    if (!person) return res.status(404).json({ error: "Person not found" });
    res.json(person);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;