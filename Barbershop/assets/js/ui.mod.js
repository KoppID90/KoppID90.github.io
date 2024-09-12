import { Barber } from './barber.cls.js';
import { createBooking, saveBooking, loadBookings } from './booking.mod.js';
import { loadBarbers, barbers } from './jsonRequest.js';
import { formatDate, validateName, validatePhone, validateEmail } from './tools.js';

let selectedBarber = null;
let selectedDate = null;
let selectedTime = null;
const container = document.querySelector('.barber-container');
const bookingContainer = document.querySelector('#booking');

/* ------------------ Barber választó --------------------- */

async function showBarbers() {
    container.innerHTML = '';

    let headerElement = bookingContainer.querySelector('#booking-header');
    if (!headerElement) {
        const text = '<h1 id="booking-header">Válaszd ki kihez szeretnél időpontot foglalni!</h1>';
        bookingContainer.insertAdjacentHTML('afterbegin', text);
    }

    const barbersData = await loadBarbers();
    barbersData.forEach(barberData => {
        const barber = new Barber(barberData);
        container.insertAdjacentHTML('beforeend', barber.generateHtml());
    });

    container.querySelectorAll('.barber-card').forEach(card => {
        card.addEventListener('click', (event) => {
            const barberId = parseInt(event.currentTarget.id, 10);
            selectedBarber = barberId;

            let headerElement = bookingContainer.querySelector('#booking-header');
            if (headerElement) {
                headerElement.remove();
            }

            showDateSelector();
        });
    });
}

/* ------------------------- Dátumválasztó -------------------------- */

async function showDateSelector() {
    const dateTpl = `
        <h1>Válaszd ki a napot, amire szeretnél foglalni</h1>
        <table class="booking-table">
            <thead>
                <tr>
                    <th>H</th>
                    <th>K</th>
                    <th>Sze</th>
                    <th>Cs</th>
                    <th>P</th>
                    <th>Szo</th>
                    <th>V</th>
                </tr>
            </thead>
            <tbody>
                <tr id="week1"></tr>
                <tr id="week2"></tr>
                <tr id="week3"></tr>
            </tbody>
        </table>
        <button class="back-button" id="back-button">Vissza</button>
    `;

    container.innerHTML = dateTpl;

    /* a hétfővel kezdődjön a "naptár" és ne vasárnappal */

    let today = new Date();
    let currentDayOfWeek = today.getDay();
    let daysSinceMonday = (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1);
    let startDate = new Date(today);
    startDate.setDate(today.getDate() - daysSinceMonday);

    let week1 = container.querySelector('#week1');
    let week2 = container.querySelector('#week2');
    let week3 = container.querySelector('#week3');

    /* csak a jelenlegi és a következő két hetet mutatja 
        múltbeli napokra nem lehet kattintani*/

    for (let i = 0; i < 21; i++) { 
        let dateOption = new Date(startDate);
        dateOption.setDate(startDate.getDate() + i);

        const dateButton = document.createElement('div');
        dateButton.classList.add('date-button');
        dateButton.innerText = dateOption.getDate();

        if (dateOption < today) {
            dateButton.style.color = 'gray';
            dateButton.style.pointerEvents = 'none';
        } else {
            dateButton.addEventListener('click', () => {
                selectedDate = dateOption;
                showTimeSelector();
            });
        }

        let weekRow;
        if (i < 7) {
            weekRow = week1;
        } else if (i < 14) {
            weekRow = week2;
        } else {
            weekRow = week3;
        }

        const dateCell = document.createElement('td');
        dateCell.appendChild(dateButton);

        if (weekRow) {
            weekRow.appendChild(dateCell);
        }
    }

    /* vissza gombot kezeli */

    const backButton = container.querySelector('#back-button');
    backButton.addEventListener('click', () => {
        showBarbers();
    });
}

/* ------------------------- Időpontválasztó -------------------------- */

async function showTimeSelector() {
    const timeTpl = `
        <h1>Válaszd ki az időpontot, amire szeretnél foglalni</h1>
        <div class="time-container">
            <div id="time-row1" class="time-row"></div>
            <div id="time-row2" class="time-row"></div>
        </div>
        <button class="back-button" id="back-button">Vissza</button>
    `;

    container.innerHTML = timeTpl;

    const timeRow1 = container.querySelector('#time-row1');
    const timeRow2 = container.querySelector('#time-row2');

    const selectedDateObj = selectedDate ? new Date(selectedDate) : new Date();
    const currentDate = new Date();
    const isToday = selectedDateObj.toDateString() === currentDate.toDateString();

    const bookings = loadBookings(); 

    /* a szalon nyitva minden nap, reggel 8-tól, 21 óráig
        imádnak dolgozni a borbélyok :) */

    for (let hour = 8; hour <= 21; hour++) {
        const formattedHour = hour.toString().padStart(2, '0');
        const timeButton = document.createElement('div');
        timeButton.classList.add('time-button');
        timeButton.innerText = `${formattedHour}:00`;

    /* dátum formázása */
        
        const timeDate = new Date(selectedDateObj);
        timeDate.setHours(hour, 0, 0, 0); 

        const formattedSelectedDate = formatDate(selectedDateObj);
        const isTimeBooked = bookings.some(booking => {
            const bookingDate = new Date(booking.date);
            const formattedBookingDate = formatDate(bookingDate);
            return formattedBookingDate === formattedSelectedDate && booking.time === `${formattedHour}:00`;
        });

        /* ha foglalt a dátum vagy már elmúlt akkor ne lehessen kiválasztani */

        if (isTimeBooked || (isToday && currentDate > timeDate)) {
            timeButton.style.color = 'gray';
            timeButton.style.pointerEvents = 'none'; 
        } else {
            timeButton.addEventListener('click', () => {
                if (timeButton.style.pointerEvents !== 'none') {
                    const selectedTime = `${formattedHour}:00`;
                    showUserInfoForm(selectedTime);
                }
            });
        }

        if (hour <= 14) {
            timeRow1.appendChild(timeButton);
        } else {
            timeRow2.appendChild(timeButton);
        }
    }

    /* vissza gombot kezeli */

    const backButton = container.querySelector('#back-button');
    backButton.addEventListener('click', () => {
        showDateSelector();
    });
}

/* ------------------------- Ügyfél adatainak bekérése -------------------------- */

function showUserInfoForm(selectedTime) {
    const formattedDate = formatDate(selectedDate);
    container.style.gap = '2px';

    container.innerHTML = `
        <h1>Adatok megadása:</h1>
        <span class="date-span">Választott időpont:<strong> ${formattedDate} ${selectedTime}</strong></span>
        <input type="text" id="name" placeholder="Név">
        <div class="error-message-name"></div>
        <input type="text" id="phone" placeholder="Telefonszám">
        <div class="error-message-tel"></div>
        <input type="email" id="email" placeholder="E-mail cím">
        <div class="error-message-email"></div>
        <div class="buttons">
            <button id="back-button" class="back-button">Vissza</button>
            <button id="next-step">Tovább</button>
        </div>
    `;

    document.querySelector('#next-step').addEventListener('click', () => {
        const name = document.querySelector('#name').value;
        const phone = document.querySelector('#phone').value;
        const email = document.querySelector('#email').value;

    
        const errorMessagesName = document.querySelector('.error-message-name');
        const errorMessagesTel = document.querySelector('.error-message-tel');
        const errorMessagesEmail = document.querySelector('.error-message-email');
        errorMessagesName.innerHTML = '';
        errorMessagesTel.innerHTML = '';
        errorMessagesEmail.innerHTML = '';

        let hasError = false;

        /*  Ellenőrizzük az adatokat */

        if (!validateName(name)) {
            errorMessagesName.innerHTML += '<p>Kérlek, add meg a teljes neved!</p>';
            hasError = true;
        }
        if (!validatePhone(phone)) {
            errorMessagesTel.innerHTML += '<p>Kérlek, add meg a helyes telefonszámot!</p>';
            hasError = true;
        }
        if (!validateEmail(email)) {
            errorMessagesEmail.innerHTML += '<p>Kérlek, add meg a helyes email címet!</p>';
            hasError = true;
        }

        if (hasError) {
            return; 
        }

        showConfirmation(selectedDate, selectedTime, name, phone, email);
    });

    /* vissza gombot kezeli */

    document.querySelector('#back-button').addEventListener('click', () => {
        container.style.gap = '20px';
        showTimeSelector();
    });
}

/* ------------------------- Foglalás megerősítése -------------------------- */

function showConfirmation(selectedDate, selectedTime, name, phone, email) {
    const barber = barbers.find(b => b.id === selectedBarber);

    const barberName = barber.name;
    const formattedDate = formatDate(selectedDate);

    container.innerHTML = `
        <h1>Foglalás megerősítése</h1>
        <h5>Borbély: ${barberName}</h5>
        <h5>Dátum: ${formattedDate}</h5>
        <h5>Időpont: ${selectedTime}</h5>
        <h5>Név: ${name}</h5>
        <h5>Telefonszám: ${phone}</h5>
        <h5>Email: ${email}</h5>
        <div class="buttons">
            <button class="back-button" id="back-button">Vissza</button>
            <button id="confirmBooking">Foglalás</button>
        </div>
    `;
    /* ha mindent adatot rendben talált a user, akkor lefoglalhatja */

    const confirmBookingButton = container.querySelector('#confirmBooking');
    confirmBookingButton.addEventListener('click', () => {
        container.style.gap = '20px';
        try {
            const booking = createBooking(barberName, selectedDate, selectedTime, { name, phone, email });
            saveBooking(booking);

            /* a foglalás eredménye */

            const confirmationResult = document.createElement('div');
            confirmationResult.id = 'confirmation-result';
            confirmationResult.innerHTML = `
                <h1 class='success-confirmation'>Kedves ${name}! <br> A foglalás sikeres volt! Várunk szeretettel!</h1>
                <button class="back-button" id="backToBookings">Vissza a foglalásokhoz</button>
            `;

            const buttons = container.querySelector('.buttons');
            if (buttons) {
                buttons.remove();
            }

            container.appendChild(confirmationResult);

            const backToBookingsButton = confirmationResult.querySelector('#backToBookings');
            backToBookingsButton.addEventListener('click', () => {
                showBarbers(); 
            });

        } catch (error) {
            const confirmationResult = document.createElement('div');
            confirmationResult.id = 'confirmation-result';
            confirmationResult.innerHTML = `
                <h1 class='failed-confirmation'>Foglalás sikertelen! Valami hiba történt. <br> Kérlek, próbáld újra!</h1>
                <button class="back-button" id="backToUserInfo">Vissza</button>
            `;

            const buttons = container.querySelector('.buttons');
            if (buttons) {
                buttons.remove();
            }

            container.appendChild(confirmationResult);

            /* vissza tud lépni új foglaláshoz */

            const backToUserInfoButton = confirmationResult.querySelector('#backToUserInfo');
            backToUserInfoButton.addEventListener('click', () => {
                showUserInfoForm(selectedTime);
            });
        }
    });
    /* vissza gombot kezeli */

    const backButton = container.querySelector('#back-button');
    backButton.addEventListener('click', () => {
        showUserInfoForm(selectedTime); 
    });
}

export {
    showBarbers, showDateSelector, showTimeSelector, showUserInfoForm, showConfirmation
}