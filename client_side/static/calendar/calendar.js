// Cache the DOM
const table_div = document.getElementById('table');
createCalendar();

const days_tab = [];
for (var i = 0; i < 42; i++){
    days_tab[i] = document.getElementById(`${i}`);
}
const monthYear_p = document.getElementById('month-year');

const headerBooking_h1 = document.getElementById('headerBooking');

// Global variables
const d = new Date();
let year = d.getFullYear();
let month = d.getMonth();

const xhr = new XMLHttpRequest();
// Functions
function logout(){
    xhr.open('DELETE', '/logout');
    xhr.onload = () => {
        location.assign("/");
    };
    xhr.send()
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
function dayofweek(d, m, y)
{
    let t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
   y -= m < 3;
   return (y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) + t[m-1] + d) % 7;
}

function getFirstWeekDayOfMonth(day, date){
    return((7 + day - (date - 1)%7)%7);
}

function writeDate(month, year){
    let monthString = getMonthString(month);
    monthYear_p.innerText = `${monthString} - ${year}`;
}
function getMonthString(month){
    const months = ["Januar", "Februar", "Mars", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    return(months[month]);
}

function updateCalendar(month, year){
    
    writeDate(month, year);

    let nbrDaysPrevMonth = nbrDayOfMonth((12+month-1)%12, year); // Works also for januar
    let firstDayOfMonth = dayofweek(1, month+1, year);
    let currDate = d.getDate();
    let currYear = d.getFullYear();
    let currMonth = d.getMonth();

    for(let i = 0; i < firstDayOfMonth ; i++){
        let date = nbrDaysPrevMonth - firstDayOfMonth + i + 1;
        //let str = `clickFun(${date}, ${(12+month-1)%12},${year - (month==0)})`; 
        days_tab[i].innerHTML = ` ${date}`;
        days_tab[i].onclick = function(){clickFun(date, (12+month-1)%12, year - (month==0))}
        days_tab[i].style.color = "grey";
        days_tab[i].style.fontWeight = "normal";
        days_tab[i].style.border = "1px solid black";
        if(currDate == date && currMonth == (12+month-1)%12 && currYear == year - (month==0)){
            days_tab[i].style.border = "2px solid red";
        }

    }
    for(let i = firstDayOfMonth; i < nbrDayOfMonth(month, year)+firstDayOfMonth; i++){
        let date = i - firstDayOfMonth + 1;
        //let str = `clickFun(${date}, ${month},${year})`;
        days_tab[i].innerHTML = ` ${date}`;
        days_tab[i].onclick = function(){clickFun(date, month, year)}
        days_tab[i].style.color = "black";
        days_tab[i].style.fontWeight = "bold";
        days_tab[i].style.border = "1px solid black";
        if(currDate == date && currMonth == month && currYear == year){
            days_tab[i].style.border = "2px solid red";
        }
    }
    for(let i = nbrDayOfMonth(month, year)+firstDayOfMonth; i < 42; i++){
        let date = i - (nbrDayOfMonth(month, year)+firstDayOfMonth) + 1;
        //let str = `clickFun(${date}, ${(month+1)%12},${year + (month==11)})`;
        days_tab[i].innerHTML = ` ${date}`;
        days_tab[i].onclick = function(){clickFun(date, (month+1)%12, year + (month==11))}
        days_tab[i].style.color = "grey";
        days_tab[i].style.fontWeight = "normal";
        days_tab[i].style.border = "1px solid black";
        if(currDate == date && currMonth == (month+1)%12 && currYear == year + (month==11)){
            days_tab[i].style.border = "2px solid red";
        }
    }
}

function prevMonth(){
    if(month == 0){
        month = 11;
        year--;
    } else{
        month--;
    }
    updateCalendar(month, year);
}

function nextMonth(){
    if(month == 11){
        month = 0;
        year++;
    } else{
        month++;
    }
    updateCalendar(month, year);
}

function createCalendar(){
    var html = "<center> <table class=\"table\"><tr><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></tr>"
    for(let i = 0; i < 6; i++){
        html = html + "<tr>";
        for(let j = 0; j < 7; j++){
            html = html + `<td class="dateBtn" id=\"${j+i*7}\"> </td>`; 
        }
        html = html + "</tr>";
    }
    html = html + "</table></center>";
    table_div.innerHTML = html;
}

function clickFun(day, month, year){
    let arrDate = [day, month, year];
    window.location=`/booking?day=${day}&month=${month}&year=${year}` // EVENTUALLY CHANGE LINK
}

function main(){
    updateCalendar(month, year)
}

main();