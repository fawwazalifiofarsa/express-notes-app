const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const verifyLogin = require("../middleware/verifyLogin");

router.use(verifyLogin);
router.route("/").get(todoController.getTodoByUser);
router.route("/").post(todoController.createTodo);
router.route("/:id").put(todoController.updateTodo);
router.route("/:id").delete(todoController.deleteTodo);

module.exports = router;
 