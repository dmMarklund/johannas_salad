const express = require("express");
const router = express.Router();
const Salad = require("../models/saladModel");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Salad Object Route

// Create a new salad Object
router.post("/salads", async (req, res) => {
  try {
    const salad = new Salad(req.body);
    await salad.save();
    res.status(201).send(salad);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all salads Objects
router.get("/salads", async (req, res) => {
  try {
    const salads = await Salad.find();
    res.send(salads);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific salad by ID
router.get("/salads/:id", async (req, res) => {
  try {
    const salad = await Salad.findById(req.params.id);
    if (!salad) {
      return res.status(404).send();
    }
    res.send(salad);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a salad by ID
router.patch("/salads/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "year",
    "weekNumber",
    "saladName",
    "rensade",
    "orsak",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const salad = await Salad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!salad) {
      return res.status(404).send();
    }
    res.send(salad);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a salad by ID
router.delete("/salads/:id", async (req, res) => {
  try {
    const salad = await Salad.findByIdAndDelete(req.params.id);
    if (!salad) {
      return res.status(404).send();
    }
    res.send(salad);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
