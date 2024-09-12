/* ------ dátum formázása-------- */
function formatDate(date) {

    const months = ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Szep", "Okt", "Nov", "Dec"];
    
    const month = months[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}`;
}

/* ------ validációk-------- */

function validateName(name) {
    return name.trim().length >= 2;
}

function validatePhone(phone) {
    const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\(?\d{2,5}\)?[-.\s]?\d{2,5}[-.\s]?\d{2,5}[-.\s]?\d{2,5}$/;
    return phoneRegex.test(phone);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export {
    formatDate, validateName, validatePhone, validateEmail
}