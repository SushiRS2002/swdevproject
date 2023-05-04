const express = require("express");
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth");
const providers = require('./routes/providers');
const reservations = require('./routes/reservations');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors=require('cors')


dotenv.config({ path: "./config/config.env" });
const app = express();

const limiter = rateLimit({
    windowsMs : 10 * 60 * 1000, //10 Minutes
    max : 100
})

//connect to database
connectDB();

app.use(cors())
app.use(express.json());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(limiter);
app.use(hpp());
app.use("/api/v1/auth", auth);
app.use('/api/v1/providers', providers);
app.use('/api/v1/reservations', reservations);
app.use(cookieParser());

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});