const express = require("express");
const noteRouter = express.Router();
const {
	getAllNotesController,
	createNewNoteController,
	updateNoteController,
	deleteNoteController,
} = require("../controllers/noteControllers");

noteRouter
	.route("/")
	.get(getAllNotesController)
	.post(createNewNoteController)
	.patch(updateNoteController)
	.delete(deleteNoteController);

module.exports = { noteRouter };
