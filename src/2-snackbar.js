import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');

/**
 * 
 * @param {number} delay
 * @param {string} state
 * @returns {Promise<number>} 
 */
function createPromise(delay, state) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });
}

/**
 *
 * @param {Event} event 
 */
function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const delay = Number(formData.get('delay'));
    const state = formData.get('state');

    createPromise(delay, state)
        .then(delayValue => {
            iziToast.success({
                message: `Fulfilled promise in ${delayValue}ms`,
                position: 'topRight',
                backgroundColor: '#59B17D',
            });
        })
        .catch(delayValue => {
            iziToast.error({
                message: `Rejected promise in ${delayValue}ms`,
                position: 'topRight',
                backgroundColor: '#EF4040',
            });
        });

    event.currentTarget.reset();
}

form.addEventListener('submit', handleSubmit);