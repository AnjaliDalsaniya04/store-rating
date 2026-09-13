const express = require("express");
const router = express.Router();
const { signup, login, updatePassword } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { validate, signupSchema, loginSchema, updatePasswordSchema } = require("../utils/validators");

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.put("/update-password", authenticate, validate(updatePasswordSchema), updatePassword);

module.exports = router;