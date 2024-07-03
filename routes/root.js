const express = require("express");
const router = express.Router();
const path = require("path");

const routes = ['/index/', '/signup/', '/login/', '/404/'];

router.get(routes, (req, res) => {
  const route = req.path.slice(0, -1).substring(1); // Get the route without the leading slash
  res.redirect(`http://localhost:8080/views/${route}.html`);
});
router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});
router.get("^/$|/login(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "login.html"));
});
router.get("^/$|/signup(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "signup.html"));
});
router.get("^/$|/404(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "404.html"));
});

module.exports = router;
