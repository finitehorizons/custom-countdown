const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdown-form");
const dateEl = document.getElementById("date-picker");
//Countdown variables
const countdownEl = document.getElementById("countdown");
const countdownTitleEl = document.getElementById("countdown-title");
const timeElements = document.querySelectorAll("span");
const countdownButton = document.getElementById("countdown-button");

const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-button");

//Glocal variables

let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

//Constants

const _SECOND = 1000;
const _MINUTE = 60 * _SECOND;
const _HOUR = 60 * _MINUTE;
const _DAY = 24 * _HOUR;

// Set Date Input Mininum to current date
const today = new Date().toISOString().split("T")[0]; // Split to get date without time
dateEl.setAttribute("min", today); // Set min date to today

//Populate Countdown / Complete UI
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;
        const days = Math.floor(distance / _DAY);
        const hours = Math.floor((distance % _DAY) / _HOUR);
        const minutes = Math.floor((distance % _HOUR) / _MINUTE);
        const seconds = Math.floor((distance % _MINUTE) / _SECOND);
        //Hide input
        inputContainer.hidden = true;
        //If countdown has ended, show complete UI
        if (distance < 0) {
            countdownEl.hidden = true;
            completeElInfo.textContent = `${countdownTitle} has ended`;
            completeEl.hidden = false;
        } else {
            // Else, show countdown UI
            countdownTitleEl.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            countdownEl.hidden = false;
            completeEl.hidden = true;
        }
    }, 1000);
}

//Take values from Form Input
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    //Save countdown to Local Storage
    localStorage.setItem("countdown", JSON.stringify(savedCountdown));
    // Check if date is valid
    if (countdownDate === "") {
        alert("Please enter a valid date");
    } else {
        // If date is valid
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

//Reset Countdown

function resetCountdown(e) {
    e.preventDefault();
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    //Stop the countdown
    clearInterval(countdownActive);
    // Reset values
    countdownTitle = "";
    countdownDate = "";
    localStorage.removeItem("countdown");
}

//Previous countdown from local storage
function restorePreviousCountdown() {
    if (localStorage.getItem("countdown") !== null) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem("countdown"));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

//Event Listeners
countdownForm.addEventListener("submit", updateCountdown);
countdownButton.addEventListener("click", resetCountdown);
completeBtn.addEventListener("click", resetCountdown);

//On load check local storage

restorePreviousCountdown();
