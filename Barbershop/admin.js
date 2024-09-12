import { loadBookings } from './assets/js/booking.mod.js';
import { displayBookings } from './assets/js/displayBookings.mod.js';
import { handleNavbarScroll } from './assets/js/navbar.js';

handleNavbarScroll();

function refreshBookings() {
    const bookings = loadBookings();
    displayBookings(bookings);
}

window.addEventListener('storage', (event) => {
    if (event.storageArea === localStorage) {
        refreshBookings();
    }
});

refreshBookings();