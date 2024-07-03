const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await User.findOne({ $or: [{ username }, { email }] })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Username or email already exist" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });
  if (user) {
    res.status(201).json({ message: `User ${username} registered` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) {
    return res.status(401).json({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) return res.status(401).json({ message: "Unauthorized" });

  if (!process.env.ACCESS_TOKEN_SECRET) {
    return res.status(500).json({ message: "Server configuration error" });
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        email: foundUser.email,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10h" }
  );

  res.status(200).json({ message: "Login success", _id: foundUser._id, accessToken: accessToken });
  console.log({ _id: foundUser._id, accessToken: accessToken })
};

module.exports = {
  signUp,
  login
};
