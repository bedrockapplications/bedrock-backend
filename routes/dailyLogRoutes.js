const express = require("express");
const { createDailyLog } = require("../controllers/dailyLogController");
const router = express.Router();


router.post("/createDailyLogs", createDailyLog);



module.exports=router;