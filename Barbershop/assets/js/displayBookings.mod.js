import { createBooking, saveBooking, loadBookings } from './booking.mod.js';

/* ----------------- A foglalás template létrehozása --------------------- */

const createBookingHTML = (booking, barber, index) => {
    const formattedDate = new Date(booking.date).toLocaleDateString();

    return `
        <tr>
            <td>${formattedDate}</td>
            <td>${booking.time}</td>
            <td>${booking.customer.name}</td>
            <td>${booking.customer.phone}</td>
            <td>${booking.customer.email}</td>
            <td><button class="delete-booking" data-barber="${barber}" data-index="${index}">Törlés</button></td>
        </tr>
    `;
};

/* ----------------- A lementett foglalások megjelenítése --------------------- */

function displayBookings(bookings) {
    const bookingInfoDiv = document.querySelector('#booking-info');
    bookingInfoDiv.innerHTML = ''; 

    if (bookings.length === 0) {
        bookingInfoDiv.innerHTML = '<p>Nincsenek foglalási adatok.</p>';
        return;
    }

    const groupedBookings = bookings.reduce((acc, booking) => {
        if (!acc[booking.barber]) {
            acc[booking.barber] = [];
        }
        acc[booking.barber].push(booking);
        return acc;
    }, {});

    for (const barber in groupedBookings) {
        groupedBookings[barber].sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));

        const table = document.createElement('table');
        table.classList.add('booking-table');
        const caption = document.createElement('caption');
        caption.innerText = `Foglalások - ${barber}`;
        table.appendChild(caption);

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Dátum</th>
                <th>Időpont</th>
                <th>Ügyfél neve</th>
                <th>Telefonszám</th>
                <th>E-mail</th>
                <th>Művelet</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        groupedBookings[barber].forEach((booking, index) => {
            tbody.innerHTML += createBookingHTML(booking, barber, index);
        });
        table.appendChild(tbody);

        bookingInfoDiv.appendChild(table);
    }

/* ----------------- Törlés gomb és a törlési folyamat------------------ */

    document.querySelectorAll('.delete-booking').forEach(button => {
        button.addEventListener('click', (event) => {
            const barber = event.target.getAttribute('data-barber');
            const index = event.target.getAttribute('data-index');
            deleteBooking(barber, parseInt(index, 10));
        });
    });
}

function deleteBooking(index) {
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.splice(index, 1);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        refreshBookings();

}

/* ----------------- Egyből frissíti az oldalt --------------------- */

function refreshBookings() {
    const bookings = loadBookings();
    displayBookings(bookings);
}

refreshBookings();

export { displayBookings };