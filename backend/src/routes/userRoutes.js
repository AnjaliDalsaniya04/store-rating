const express = require("express");
const router = express.Router();
const { listStoresForUser, submitRating } = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/auth");
const { validate, ratingSchema } = require("../utils/validators");

router.get("/stores", authenticate, authorize("USER"), listStoresForUser);
router.post("/stores/:id/rating", authenticate, authorize("USER"), validate(ratingSchema), submitRating);

module.exports = router;