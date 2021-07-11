// Cache the DOM
const headerBooking_h1 = document.getElementById("headerBooking");

let parameters = new URLSearchParams(window.location.search);
let day = parameters.get('day');
let month = parameters.get('month');
let year = parameters.get('year');

const xhr = new XMLHttpRequest();
setHeaderandURL(day, month, year)

function setHeaderandURL(day, month, year){
    if(day && month && year){
        parameters.set('day', day);
        parameters.set('month', month);
        parameters.set('year', year);
        window.history.replaceState({}, '', `${location.pathname}?${parameters}`);
        headerBooking_h1.innerText = `${day} ${getMonthString(month)}-${year}`;
        //if(day<10){day ='0'+ day} if(month<10){month='0'+month};
        document.getElementById("day").value = day;
        document.getElementById("month").value = month;
        document.getElementById("year").value = year;
    }
}

function getMonthString(month){
    const months = ["Januar", "Februar", "Mars", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    return(months[month]);
}

function sendHTTPRequest(method, url, data){
    return new Promise((resolve, reject) => {

        //const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.responseType = 'json';
        xhr.onload = () => {
            if(this.status >= 400){
                //alert(`Errorcode = ${xhr.status}`)
                reject(console.log("error"));
            } else{
                console.log(`xhr.responseType = ${xhr.responseType}`)
                resolve(xhr.response);
            }
        };
        xhr.onerror = () =>{
            reject('something error');
        }
       if(data){   
            xhr.setRequestHeader('content-type', 'application/json');
            xhr.send(JSON.stringify(data));
        }else{
            xhr.send();
        }
    });
}


function myGetData() {
    sendHTTPRequest('GET', '/booking');
}


function mySendData(){
    let parameters = new URLSearchParams(window.location.search);
    let desc = document.getElementById("desc").value;
    let startDate = new Date('1970-01-01T' + document.getElementById("startTime").value);
    let endDate = new Date('1970-01-01T' + document.getElementById("endTime").value);
    //alert(`${endTime.getHours()}`)
    
    // adding check for already booked
    
    // ending check

    if(desc){
        let startTime = [startDate.getHours(), startDate.getMinutes()];
        let endTime = [endDate.getHours(), endDate.getMinutes()];
        if(startTime[0] < 10) startTime[0] = "0" + startTime[0];
        if(startTime[1] < 10) startTime[1] = "0" + startTime[1];
        if(endTime[0] < 10) endTime[0] = "0" + endTime[0];
        if(endTime[1] < 10) endTime[1] = "0" + endTime[1];

        const data = {
            "date": new Date(parameters.get('year'), parameters.get('month'), parameters.get('day')),
            "startTime": startTime,
            "endTime": endTime,
            "user": "CH",
            "message": desc
        }
        
        sendHTTPRequest('POST','/booking' , data).then( (msg) => {
            console.log()
        })
        alert('submitted')
        
    }    
}

function myDelete(id){
    const data = {
        "id": id
    } 
    sendHTTPRequest('DELETE', '/booking', data).then(() =>{
        location.reload();
    });
}

function newDay(change){
    day = parseInt(day);
    month = parseInt(month);
    year = parseInt(year);

    day = day + change;
    if (day == 0){
        if(month != 0){
            month = month - 1;
            day = nbrDayOfMonth(month, year);
        }else{
            month = 11;
            year = year - 1;
            day = nbrDayOfMonth(month, year); 
        }
    } else if(day > nbrDayOfMonth(month, year)){
        if(month != 11){
            month = month + 1;
            day = 1;
        } else{
            month = 0;
            year = year + 1;
            day = 1;
        }
    }
    setHeaderandURL(day, month, year);
    location.reload();
}

function nbrDayOfMonth(month, year){
    let nbrDays;
    switch(month){
        case 0: 
        case 2: 
        case 4: 
        case 6:
        case 7:
        case 9: 
        case 11:
            nbrDays = 31;
            break;
        case 2:
            if (isLeapYear(year)){
                nbrDays = 29;
            }else{
                nbrDays = 28;
            }
            break;
        default:
            nbrDays = 30;
    }
    return nbrDays;

    function isLeapYear(year){
        if(year%100 == 0){
            return(year%400 == 0);
        } else{
            return(year%4 == 0);
        }
    }
}

function logout(){
    
    sendHTTPRequest('DELETE', '/logout').then(() =>{
        
        location.assign("/")
    });
}