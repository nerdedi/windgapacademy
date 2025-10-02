/**
 * Google Sign-In API Route
 */
const express = require("express");
const router = express.Router();
const googleAuthController = require("../controllers/googleAuthController");

// Google Sign In callback endpoint
router.get("/callback", googleAuthController);

module.exports = router;
