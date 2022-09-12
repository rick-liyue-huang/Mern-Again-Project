const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3500;

app.use("/", express.static(path.join(__dirname, "/public")));
// use it after use the static source
app.use("/", require("./routes/root"));

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

app.listen(PORT, () => {
	console.log(`this server is running on port of ${PORT}`);
});
