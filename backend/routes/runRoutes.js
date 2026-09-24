const express = require("express");
const router = express.Router();

const { runCode } = require("../controllers/runController");
const rateLimitRunCode = require("../middleware/rateLimitRunCode");


router.post("/run", rateLimitRunCode, runCode);
// router.get("/run/:jobId", getRunResult);

module.exports = router;