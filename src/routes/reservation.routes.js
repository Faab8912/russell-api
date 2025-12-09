const router = require("express").Router({ mergeParams: true });
const auth = require("../middlewares/auth");
const ctrl = require("../controllers/reservation.controller");

router.get("/:id/reservations", auth, ctrl.list);
router.get("/:id/reservations/:idReservation", auth, ctrl.getOne);
router.post("/:id/reservations", auth, ctrl.create);
router.put("/:id/reservations", auth, ctrl.update);
router.delete("/:id/reservations/:idReservation", auth, ctrl.remove);

module.exports = router;
