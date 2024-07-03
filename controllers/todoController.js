const Todo = require("../models/Todo");
const User = require("../models/User");

const getTodos = async (req, res) => {
  const todos = await Todo.find().lean();

  if (!todos?.length) {
    return res.status(400).json({ message: "No todos found" });
  }

  res.json(todos);
};

const getTodoByUser = async (req, res) => {
  const { user_id } = req.query;
  const todos = await Todo.find({ user_id }).lean();

  if (!todos?.length) {
    return res.status(400).json({ message: "No todos found" });
  }

  res.status(200).json(todos);
};

const createTodo = async (req, res) => {
  const { user_id, task, priority, completed } = req.body;
  if (!user_id || !task || !priority || !completed) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(user_id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const duplicate = await Todo.findOne({ task }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate todo task" });
  }

  const todo = await Todo.create({ user_id, task, priority, completed });
  if (todo) {
    return res.status(201).json({ message: "New todo created" });
  } else {
    return res.status(400).json({ message: "Invalid todo data received" });
  }
};

const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { task, priority, completed } = req.body;
  if (!task || !priority || !completed) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const todo = await Todo.findById(id).exec();
  if (!todo) {
    return res.status(400).json({ message: "Todo not found" });
  }

  const duplicate = await Todo.findOne({ task })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate todo task" });
  }

  todo.task = task;
  todo.priority = priority;
  todo.completed = completed;

  const updatedTodo = await todo.save();

  res.status(201).json({ message: `Todo '${task}' updated`, todo: updatedTodo });
};

const deleteTodo = async (req, res) => {
  const { id } = req.params;

  const todo = await Todo.findById(id).exec();

  if (!todo) {
    return res.status(400).json({ message: "Todo not found" });
  }

  await Todo.deleteOne({ _id: id });
  res.status(200).json({ message: `Todo '${todo.task}' with ID ${todo._id} deleted` });
};

module.exports = {
  getTodos,
  getTodoByUser,
  createTodo,
  updateTodo,
  deleteTodo,
};
