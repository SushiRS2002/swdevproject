const express = require("express");
const {getProviders, getProvider, createProvider, updateProvider, deleteProvider} = require("../controllers/providers");
const reservationRouter = require("./reservations");
const router = express.Router();
const {protect, authorize} = require("../middleware/auth");

router.use("/:providerId/reservations/", reservationRouter);
router.route("/").get(getProviders).post(protect, authorize("admin"), createProvider);
router.route("/:id").get(getProvider).put(protect, authorize("admin"), updateProvider).delete( protect, authorize("admin"),deleteProvider);

module.exports = router;