let barbers = [];

async function loadBarbers() {
    try {
        const response = await fetch('./barbers.json');
        barbers = await response.json();
        return barbers;
    } catch (error) {
        console.error('Hiba történt a borbélyok betöltése során:', error);
        return [];
    }
}

function getBarberName(selectedBarber) {
    const barber = barbers[selectedBarber];
    if (!barber || !barber.name) {
        console.error('Borbély nem található.');
        return 'Borbély nem található.';
    }

    return barber.name;
}


export {
    loadBarbers, barbers, getBarberName
};

