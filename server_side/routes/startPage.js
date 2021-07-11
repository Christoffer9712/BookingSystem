const express = require("express");
const path = require("path");
let router = express.Router();

let parentPath = path.dirname(`${__dirname}`); 
let grandparentPath = path.dirname(parentPath);
router
    .route("/")
    .get((req, res) => {
        res.sendFile(`${grandparentPath}/client_side/static/start_page/startPage.html`)
    })

module.exports = router;