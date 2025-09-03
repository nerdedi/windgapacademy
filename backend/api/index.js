const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/users", require("./users"));
router.use("/assignments", require("./assignments"));
router.use("/materials", require("./materials"));

module.exports = router;
