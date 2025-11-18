require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

// Import database connection
const connectDB = require("./src/config/database");
connectDB();

// Import routes
// const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Done!')
})