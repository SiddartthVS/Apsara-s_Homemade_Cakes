function parseOffers(txt) {
    const content = txt.trim();
    if (!content) return [];

    return content.split(/\n\s*\n/).map(block => {
        const lines = block.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        if (lines.length === 0) return null;

        const offer = { title: "", image: "", description: "" };

        lines.forEach(line => {
            const separatorIndex = line.indexOf(":");
            if (separatorIndex === -1) return;

            const key = line.slice(0, separatorIndex).trim().toLowerCase();
            const value = line.slice(separatorIndex + 1).trim();

            if (key === "title") offer.title = value;
            else if (key === "image") offer.image = value;
            else if (key === "description") offer.description = value;
        });

        if (!offer.title || !offer.image || !offer.description) return null;
        return offer;
    }).filter(Boolean);
}

function renderOfferCard(offer) {
    return `
        <div class="card">
            <img src="images/test/${offer.image}" alt="Offer">
            <span class="card__hint">Tap to reveal →</span>
            <div class="card__content">
                <h3 class="card__title">${offer.title}</h3>
                <p class="card__description">${offer.description}</p>
                <span class="card__hint card__hint--close">Tap anywhere to close ←</span>
            </div>
        </div>
    `;
}

function renderOffers(offers) {
    const offersSection = document.getElementById("offers");
    const offersContainer = document.getElementById("offers-container");

    if (!offersSection || !offersContainer) return;

    if (offers.length === 0) {
        offersSection.style.display = "none";
        return;
    }

    offersSection.style.display = "";
    offersContainer.innerHTML = "";

    for (let i = 0; i < offers.length; i += 2) {
        const grid = document.createElement("div");
        grid.className = "offers-grid";
        grid.innerHTML = renderOfferCard(offers[i]) + (offers[i + 1] ? renderOfferCard(offers[i + 1]) : "");
        offersContainer.appendChild(grid);
    }
}

function loadOffers() {
    fetch("data/offers.txt")
        .then(response => {
            if (!response.ok) throw new Error("Failed to load offers.txt");
            return response.text();
        })
        .then(txt => {
            const offers = parseOffers(txt);
            renderOffers(offers);
        })
        .catch(error => {
            console.error("Offers loading error:", error);
            const offersSection = document.getElementById("offers");
            if (offersSection) offersSection.style.display = "none";
        });
}

document.addEventListener("DOMContentLoaded", loadOffers);