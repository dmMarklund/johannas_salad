const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path"); // Import the path module
require("dotenv").config();
const apiRoutes = require("./routes/api");
const accessRoute = require("./routes/auth");

const app = express();
const port = 4000;

// Connect to the MongoDB database
const url = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(
  cors({
    origin: ["http://159.89.110.54:4001", "http://localhost:3000"],
    credentials: true,
  })
);
app.disable("x-powered-by");
app.use(cookieParser());

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "build")));

// Routes
app.use("/api/auth", accessRoute);
app.use("/api/data", apiRoutes);

// Serve the React app on home route
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
