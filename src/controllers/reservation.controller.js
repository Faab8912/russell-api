const Joi = require("joi");
const Reservation = require("../models/Reservation");
const Catway = require("../models/Catway");

const baseSchema = Joi.object({
  clientName: Joi.string().min(2).required(),
  boatName: Joi.string().min(2).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
});

const checkCatway = async (catwayNumber) => {
  const exists = await Catway.findOne({ catwayNumber });
  if (!exists) throw new Error("Catway introuvable");
};

const overlaps = async (catwayNumber, startDate, endDate, excludeId = null) => {
  const query = {
    catwayNumber,
    $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }],
  };
  if (excludeId) query._id = { $ne: excludeId };
  const found = await Reservation.findOne(query);
  return !!found;
};

exports.list = async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.id);
    await checkCatway(catwayNumber);
    const items = await Reservation.find({ catwayNumber }).sort({
      startDate: -1,
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.id);
    await checkCatway(catwayNumber);
    const item = await Reservation.findOne({
      _id: req.params.idReservation,
      catwayNumber,
    });
    if (!item)
      return res.status(404).json({ message: "Réservation introuvable" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.id);
    await checkCatway(catwayNumber);
    const { error, value } = baseSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const startDate = new Date(value.startDate);
    const endDate = new Date(value.endDate);
    if (endDate < startDate)
      return res
        .status(400)
        .json({ message: "endDate doit être postérieure à startDate" });

    const hasOverlap = await overlaps(catwayNumber, startDate, endDate);
    if (hasOverlap)
      return res.status(409).json({ message: "Chevauchement de réservation" });

    const created = await Reservation.create({ ...value, catwayNumber });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.id);
    await checkCatway(catwayNumber);
    const { error, value } = baseSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const startDate = new Date(value.startDate);
    const endDate = new Date(value.endDate);
    if (endDate < startDate)
      return res
        .status(400)
        .json({ message: "endDate doit être postérieure à startDate" });

    const excludeId = req.body._id || req.query.id;
    const hasOverlap = await overlaps(
      catwayNumber,
      startDate,
      endDate,
      excludeId
    );
    if (hasOverlap)
      return res.status(409).json({ message: "Chevauchement de réservation" });

    const updated = await Reservation.findOneAndUpdate(
      { _id: req.body._id, catwayNumber },
      { $set: { ...value } },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Réservation introuvable" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.id);
    await checkCatway(catwayNumber);
    const deleted = await Reservation.findOneAndDelete({
      _id: req.params.idReservation,
      catwayNumber,
    });
    if (!deleted)
      return res.status(404).json({ message: "Réservation introuvable" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
