const barberTpl = barber => `
    <div class="barber-card" id="${barber.id}">
        <img src="./assets/img/${barber.img || 'noimage.jpg'}" alt="Barber Image">
        <div class="barber-card-content">
            <h3>${barber.name}</h3>
            <p>${barber.introduction}</p>
        </div>
    </div>
`;

class Barber {
    #barber; 

    constructor(barber) {
        this.#barber = barber;
    }

    generateHtml() {
        return barberTpl(this.#barber);
    }

    get id() {
        return this.#barber.id;
    }

    get name() {
        return this.#barber.name;
    }

    get introduction() {
        return this.#barber.introduction;
    }
}

export { Barber };