const express = require("express");
const router = express.Router();

const { runCode,getRunResult} = require("../controllers/runController");

router.post("/run", runCode);
router.get("/run/:jobId", getRunResult);

module.exports = router;