const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');
const timeEl = document.getElementById('time-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownTime = '';
let countdownValue = new Date();

let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set timezone offset
const localOffset = (-1) * countdownValue.getTimezoneOffset() * minute;

// Set date input min w/ today's date
const today = new Date();
dateEl.setAttribute('min', today);

// This function populates the countdown and completes UI
function updateDOM() {
    countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    // Hide input
    inputContainer.hidden = true;

    console.log(distance);

    // If countdown has ended, show complete
    if (distance < 0) {
        countdownEl.hidden = true;
        clearInterval(countdownActive);
        completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
        completeEl.hidden = false;
    } else {
        // Else show the countdown progress
        countdownElTitle.textContent = `${countdownTitle}`;
        timeElements[0].textContent = `${days}`;
        timeElements[1].textContent = `${hours}`;
        timeElements[2].textContent = `${minutes}`;
        timeElements[3].textContent = `${seconds}`;
        // Show countdown
        completeEl.hidden = true;
        countdownEl.hidden = false;
        }
    }, second);
}

// Takes values from the input form
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    countdownTime = e.srcElement[2].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
        time: countdownTime,
    }
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    // Check for valide date
    if (countdownDate === '') {
        alert('Please select a date for the countdown.');
    } else if (countdownTime === '') {
        alert('Please select a time for the countdown.');
    } else {
        // Get's number version of current Date and updates DOM
        countdownValue = new Date(`${countdownDate}T${countdownTime}:00`).getTime();
        updateDOM();
    }
}

// Resets all values on countdown
function reset() {
    // Hide countdown and show input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // Stop the countdown
    clearInterval(countdownActive);
    // Reset values
    countdownTitle = '';
    countdownDate = '';
    countdownTime = '';
    localStorage.removeItem('countdown');
    restorePreviousCountdown();
}

function restorePreviousCountdown() {
    // Get countdown from localStorage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownTime = savedCountdown.time;
        countdownValue = new Date(`${countdownDate}T${countdownTime}:00`).getTime();
        updateDOM();
    }
}

// Event listener
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On load, check local storage
restorePreviousCountdown();