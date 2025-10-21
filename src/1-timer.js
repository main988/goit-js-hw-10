import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const timerFields = {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let countdownInterval = null;

/**
 *
 * @param {number} value
 * @returns {string}
 */
function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

/**
 * 
 * @param {number} ms
 * @returns {{days: number, hours: number, minutes: number, seconds: number}}
 */
function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

/**
 *
 * @param {{days: number, hours: number, minutes: number, seconds: number}} timeObj
 */
function updateTimerInterface(timeObj) {
    timerFields.days.textContent = String(timeObj.days).padStart(2, '0');
    timerFields.hours.textContent = addLeadingZero(timeObj.hours);
    timerFields.minutes.textContent = addLeadingZero(timeObj.minutes);
    timerFields.seconds.textContent = addLeadingZero(timeObj.seconds);
}

/**
 *
 */
function stopTimer() {
    clearInterval(countdownInterval);
    countdownInterval = null;
    datetimePicker.disabled = false;
    startButton.disabled = true;

    iziToast.success({
        title: 'Завершено! 🎉',
        message: 'Зворотний відлік завершено!',
        position: 'topRight',
    });
}

function countdown() {
    const now = new Date().getTime();
    const remainingTimeMs = userSelectedDate.getTime() - now;

    if (remainingTimeMs <= 0) {
        stopTimer();
        updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
    }

    const time = convertMs(remainingTimeMs);
    updateTimerInterface(time);
}

function handleStartClick() {
    if (!userSelectedDate || countdownInterval) {
        return;
    }

    startButton.disabled = true;
    datetimePicker.disabled = true;

    countdown();
    countdownInterval = setInterval(countdown, 1000);
}

const flatpickrOptions = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];
        const now = new Date();

        if (selectedDate.getTime() <= now.getTime()) {
            startButton.disabled = true;
            userSelectedDate = null;
            iziToast.error({
                message: 'Please choose a date in the future',
                position: 'topRight',
                timeout: 3000,
            });
        } else {
            startButton.disabled = false;
            userSelectedDate = selectedDate;
        }
    },
};

flatpickr(datetimePicker, flatpickrOptions);

startButton.addEventListener('click', handleStartClick);

updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });