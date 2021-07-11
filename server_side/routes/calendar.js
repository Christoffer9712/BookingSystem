const express = require("express");
const path = require("path");
let router = express.Router();

let parentPath = path.dirname(`${__dirname}`); 
let grandparentPath = path.dirname(parentPath);
router
    .route("/")
    .get((req, res) => {
        var buttonText = "Log in";
        if(req.isAuthenticated()){
            buttonText = "Log out";
        } else {
            buttonText = "Log in";
        }
        res.render(grandparentPath + `/client_side/dynamic/calendar.ejs`, {
            buttonText: buttonText
        });
    })

module.exports = router;