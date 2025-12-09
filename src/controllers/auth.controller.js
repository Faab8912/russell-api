const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/User");

const registerSchema = Joi.object({
  username: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const exists = await User.findOne({ email: value.email });
    if (exists) return res.status(409).json({ message: "Email déjà utilisé" });

    const user = await User.create(value);
    res
      .status(201)
      .json({ id: user._id, email: user.email, username: user.username });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const user = await User.findOne({ email: value.email });
    if (!user)
      return res.status(401).json({ message: "Identifiants invalides" });

    const ok = await user.comparePassword(value.password);
    if (!ok) return res.status(401).json({ message: "Identifiants invalides" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
};
