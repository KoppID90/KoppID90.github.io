function createBooking(barber, date, time, customer) {
  return { barber, date, time, customer };
}

function saveBooking(booking) {
  const bookingDate = new Date(booking.date);
  const formattedDate = bookingDate.toLocaleDateString('hu-HU');
  booking.date = formattedDate;

  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  bookings.push(booking);
  localStorage.setItem('bookings', JSON.stringify(bookings));
}

function loadBookings() {
  const bookingsJSON = localStorage.getItem('bookings');
  let bookings = JSON.parse(bookingsJSON) || [];
  return bookings;
}

export {
  createBooking, saveBooking, loadBookings
}