const Joi = require("joi");
const Catway = require("../models/Catway");

const createSchema = Joi.object({
  catwayNumber: Joi.number().integer().required(),
  catwayType: Joi.string().valid("long", "short").required(),
  catwayState: Joi.string().min(2).required(),
});

const updateSchema = Joi.object({
  catwayState: Joi.string().min(2).required(),
});

exports.list = async (req, res, next) => {
  try {
    const items = await Catway.find().sort({ catwayNumber: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Catway.findOne({ catwayNumber: Number(req.params.id) });
    if (!item) return res.status(404).json({ message: "Catway introuvable" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const exists = await Catway.findOne({ catwayNumber: value.catwayNumber });
    if (exists)
      return res.status(409).json({ message: "catwayNumber déjà utilisé" });

    const item = await Catway.create(value);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const item = await Catway.findOneAndUpdate(
      { catwayNumber: Number(req.params.id) },
      { $set: { catwayState: value.catwayState } },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Catway introuvable" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const del = await Catway.findOneAndDelete({
      catwayNumber: Number(req.params.id),
    });
    if (!del) return res.status(404).json({ message: "Catway introuvable" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
