const express = require("express");
const router = express.Router();
const { getOwnerDashboard } = require("../controllers/storeOwnerController");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/dashboard", authenticate, authorize("STORE_OWNER"), getOwnerDashboard);

module.exports = router;