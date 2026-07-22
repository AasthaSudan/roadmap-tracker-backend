const express = require("express");

const {
    threadPoolDemo,
} = require("../controllers/threadPoolController");

const {
    syncRead,
    asyncRead,
} = require("../controllers/fsController");

const router = express.Router();

router.get("/threadpool", threadPoolDemo);

router.get("/sync-read", syncRead);

router.get("/async-read", asyncRead);

module.exports = router;