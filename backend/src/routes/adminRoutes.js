const express = require("express");
const router = express.Router();
const {
  getDashboard, createUser, listUsers, getUserDetail, createStore, listStores,
} = require("../controllers/adminController");
const { authenticate, authorize } = require("../middleware/auth");
const { validate, adminCreateUserSchema, storeSchema } = require("../utils/validators");

router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", getDashboard);
router.post("/users", validate(adminCreateUserSchema), createUser);
router.get("/users", listUsers);
router.get("/users/:id", getUserDetail);
router.post("/stores", validate(storeSchema), createStore);
router.get("/stores", listStores);

module.exports = router;