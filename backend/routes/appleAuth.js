/**
 * Apple Sign-In API Route
 */
const express = require("express");
const router = express.Router();
const appleAuthController = require("../controllers/appleAuthController");

// Apple Sign In callback endpoint
router.get("/callback", appleAuthController);

module.exports = router;
