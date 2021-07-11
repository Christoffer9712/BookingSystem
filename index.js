const express = require("express");
const app = express();
const port = process.env.port || 4444;

// New
    //app.use(express.urlencoded({ extended: false }))
    const Users = require(__dirname+'/server_side/models/UserSchema');

    const passport = require('passport')
    const flash = require('express-flash')
    const session = require('express-session')
    /*
    Users.find({'username': 'a'}, (err, user) => {
        console.log(user[0])
    })
    */
    const initializePassport = require(__dirname+'/server_side/other/passport-config');

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
//

app.set('view engine', 'ejs');

app.use(express.json());

app.use(express.static(__dirname+'/client_side/static'))


// NEW

    //app.use("/", require(__dirname+"/server_side/routes/signIn.js"));
    //app.use("/register", require(__dirname+"/server_side/routes/register.js"));
    let errMsg = "";
    app.get("/register", (req, res) => {
        res.render(__dirname+'/client_side/dynamic/register.ejs', {
            msg: "",
        })
    })
    app.post("/register", (req, res) => {
        //const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const promise = new Promise((resolve, reject) => {
            Users.find({'username': req.body.username}, (err, user) => {
                if(err){
                    reject(err);
                }
                if(user[0]){
                    errMsg = "Usename is already used";
                    resolve("false");
                } else{
                    errMsg = "";
                    resolve("true");
                }
            })
        })

        promise.then( (bool) =>{
        if(bool == "true"){
            Users.create({
                'username': req.body.username,
                'password': req.body.password
            })
            res.redirect('/')
        } else{
            res.render(__dirname+'/client_side/dynamic/register.ejs', {
                msg: errMsg,
            })
        }
        })
        
    })

    app.get("/", (req, res) => {
        /*
        getUserByUsername = (username) => {
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
        }
        
        getUserByUsername('frank').then((user) => {
            console.log(user)
        })
        */
        res.render(__dirname+'/client_side/dynamic/signIn.ejs', {
            msg: req.flash().error,
        })
    })
    app.post("/",
      passport.authenticate('local', {
        successRedirect: '/start_page',
        failureRedirect: '/',
        failureFlash: true
      })
    )

    app.delete("/logout", (req, res) => {
        req.logout();
        res.send()
    })
      
    //})
//
app.use("/start_page", require(__dirname+"/server_side/routes/startPage.js"));

app.use("/calendar", require(__dirname+"/server_side/routes/calendar"));

app.use("/booking", require(__dirname+"/server_side/routes/booking"));


app.listen(port, () =>{
    console.log(`Listining on port ${port}`);
})

// connect to database
const connectDB = require(__dirname+"/server_side/other/connectDB")
connectDB();

