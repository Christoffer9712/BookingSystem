const express = require("express");
const path = require("path");
const router = express.Router();
const Booking = require("../models/bookingSchema");

let signedIn = 'Log out';
let msg = "";
let someDate = new Date(0, 0, 0, 0, 0, 0); // In order to note when the url change and reset msg

router
    .route("/")
    .get((req, res) => {
        let currDate = getCurrDate(req.url);
        if(currDate.toString() != someDate.toString()) {
            msg = "";
            someDate = currDate;
        }
        updatePage(req, res, msg);  
    })
    .post((req, res) => { 
        if(req.isAuthenticated()){
            req.body.user = req.user.username;
        } else{
            req.body.user = "Guest - Not Signed In"
        }
        let currDate = req.body.date;
        let startTimeMin = req.body.startTime[0]*60 + Number(req.body.startTime[1]); 
        let endTimeMin = req.body.endTime[0]*60 + Number(req.body.endTime[1]);

        const promise = new Promise( (resolve, reject) => {
            if(endTimeMin < startTimeMin){
                reject("Start time must be before end time")
            }
            Booking.find({'date':currDate}, (err, booking) => {
                booking.forEach((booking) => {
                    let bookStartTimeMin = booking.startTime[0]*60 + Number(booking.startTime[1]);
                    let bookEndTimeMin = booking.endTime[0]*60 + Number(booking.endTime[1]);

                    if( (bookStartTimeMin <= startTimeMin && endTimeMin <= bookEndTimeMin) || 
                        (startTimeMin < bookEndTimeMin && endTimeMin >= bookEndTimeMin) ||
                        (startTimeMin <= bookStartTimeMin && endTimeMin > bookStartTimeMin) ){
                            reject("Time is already booked");
                    }
                })
                resolve();
            })
        }).then(() => {
                msg ="";
                Booking.create(req.body).then( () => {
                    let parentPath = path.dirname(`${__dirname}`); 
                    let grandparentPath = path.dirname(parentPath);
                    Booking.find({'date':req.body.date}, (err, booking) => {
                        res.render(grandparentPath + '/client_side/dynamic/booking.ejs', {
                            bookingList: booking,
                            buttonText: signedIn,
                            message: msg
                        })               
                    })   
                });           
        })
        .catch((rejMsg) =>{
            //console.log("time is already booked");
            msg = rejMsg;
            updatePage(req, res, msg);
        })
        
    })
    .delete( (req, res) => {
        if(req.isAuthenticated()){
            msg = "";
            Booking.findByIdAndDelete({_id: req.body.id}).then( () => {
                updatePage(req, res, msg);
            });
        } else{
            msg = "You have to be signed in to remove activity";
            updatePage(req, res, msg);
        }
    })

function updatePage(req, res, msg) {
    if(req.isAuthenticated()){
        signedIn = "Log out";
    } else{
        signedIn = "Log in";
    }
    let currDate = getCurrDate(req.url);
    let parentPath = path.dirname(`${__dirname}`); 
    let grandparentPath = path.dirname(parentPath);
    Booking.find({'date':currDate}, (err, booking) => {
        booking.sort( GetSortOrder("startTime") );
        res.render(grandparentPath + '/client_side/dynamic/booking.ejs', {
            bookingList: booking,
            buttonText: signedIn,
            message: msg
        })
    });
    
}

function getCurrDate(url){
    var split = (url).split("/");
    var params = new URLSearchParams(split[1]);
    return(new Date(params.get('year'), params.get('month'), params.get('day'), 0, 0, 0));

}


function GetSortOrder(prop){
    return function(a,b){
        let aa = a[prop];
        let bb = b[prop];

        if( aa[0]*60 + Number(aa[1]) > bb[0]*60 + Number(bb[1])){
            return 1;
        }else if( aa[0]*60 + Number(aa[1]) < bb[0]*60 + Number(bb[1]) ){
            return -1;
        }
        return 0;
    }
    }

module.exports = router;