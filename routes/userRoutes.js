const express = require("express");
const userRouter = express.Router();
const {
	getAllUsersController,
	createNewUserController,
	updateUserController,
	deleteUserController,
} = require("../controllers/userControllers");

userRouter
	.route("/")
	.get(getAllUsersController)
	.post(createNewUserController)
	.patch(updateUserController)
	.delete(deleteUserController);

module.exports = { userRouter };
