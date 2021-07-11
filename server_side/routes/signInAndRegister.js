// Does not work 
const express = require("express");
const app = express();
const Users = require("../models/userSchema");
const path = require("path");
let router = express.Router();

const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('../other/passport-config');

initializePassport(
passport,
(username) => {
    return(new Promise((resolve, reject) => {
        Users.find({'username': username}, (err, user) => {
            if(err){
                reject(err);
            }
            if(user[0]){
                resolve(user[0]);
            } else{
                resolve(null);
            }
        })
    }))   
})

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

let parentPath = path.dirname(`${__dirname}`); 
let grandparentPath = path.dirname(parentPath);
router
    .get("/", (req, res) => {
        res.sendFile(grandparentPath+'/client_side/static/sign_in/signIn.html')
    })
    .post("/", (req, res) =>{
        passport.authenticate('local', {
            successRedirect: '/start_page',
            failureRedirect: '/',
            failureFlash: true
        })
    })
    
    .get("/register", (req, res) => {
        res.sendFile(grandparentPath+'/client_side/static/register/register.html')
    })
    .post("/register", (req, res) => {
        console.log(req.params)
        Users.create({
            'username': req.body.username,
            'password': req.body.password
        })
        res.redirect('/')
    })

module.exports = tmpFun;
    