const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { logger, logEvents } = require("./middlewares/logger");
const { errorHandler } = require("./middlewares/errorHandler");
const { corsOptions } = require("./config/corsOptions");
const { connectDB } = require("./config/mongDB");
const { userRouter } = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

// connect MongoDB
connectDB();

/**
 * add some middlewares
 */
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// built in middleware
app.use("/", express.static(path.join(__dirname, "public")));
// app.use(express.static('public'));

/**
 * define routes rules
 */
app.use("/", require("./routes/root"));
app.use("/users", userRouter);

/**
 * define the 404 route rules
 */
app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ message: "404 not found" });
	} else {
		res.type("txt").send("404  not found");
	}
});

app.use(errorHandler);

/**
 * confirm the mongoDB is connected
 */
mongoose.connection.once("open", () => {
	console.log("connected to Mongo DB");
	app.listen(PORT, () => {
		console.log(`this server is running on port of ${PORT}`);
	});
});

mongoose.connection.on("error", (err) => {
	console.log(err);
	logEvents(
		`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
		"mongoErrLog.log"
	);
});
