function parseData(txt) {
    return txt
        .split(/\n\s*\n/)
        .map(block => {
            const lines = block
                .split(/\r?\n/)
                .map(line => line.trim())
                .filter(Boolean);

            if (lines.length === 0) return null;

            const item = {
                title: "",
                images: [],
                badges: [],
                description: "",
                info: []
            };

            item.title = lines[0];

            let startIndex = 1;

            if (lines[startIndex] && /^IMAGES\s*:/i.test(lines[startIndex])) {
                item.images = lines[startIndex]
                    .replace(/^IMAGES\s*:/i, "")
                    .split(",")
                    .map(s => s.trim())
                    .filter(Boolean);

                startIndex++;
            }

            if (
                lines[startIndex] &&
                !/^\s*(.*?)\s*-\s*₹\s*[\d,]+(?:\.\d+)?\s*$/.test(lines[startIndex])
            ) {
                item.description = lines[startIndex];
                startIndex++;
            }

            for (let i = startIndex; i < lines.length; i++) {
                const match = lines[i].match(
                    /^(.*?)\s*-\s*(₹\s*[\d,]+(?:\.\d+)?)\s*$/
                );

                if (!match) continue;

                let label = match[1].trim();
                const price = match[2].trim();

                const badgeMatch = label.match(/\(([^()]*)\)\s*$/);

                let rowBadges = [];

                if (badgeMatch) {
                    rowBadges = badgeMatch[1]
                        .split("|")
                        .map(b => b.trim())
                        .filter(Boolean);

                    label = label
                        .replace(/\s*\([^()]*\)\s*$/, "")
                        .trim();
                }

                item.info.push({
                    label: label,
                    badges: rowBadges,
                    price: price
                });
            }

            return item;
        })
        .filter(Boolean);
}


function renderCard(item) {
    const imgs = (item.images || []).map(i => `images/brownies/${i}`);
    const defaultImg = imgs[0] || "https://picsum.photos/400/400";

    const description = item.description
        ? `<p class="card-description">${item.description}</p>`
        : "";

    const rows = (item.info || [])
        .map(row => {
            const rowBadges = (row.badges || [])
                .map(b => `<span class="row-badge">${b}</span>`)
                .join("");

            return `
                <div class="info-row">
                    <div class="info-label">
                        <span class="info-name">${row.label}</span>
                        ${rowBadges ? `<span class="row-badges">${rowBadges}</span>` : ""}
                    </div>

                    <span class="price">${row.price}</span>
                </div>
            `;
        })
        .join("");

    const viewBtn = imgs.length > 1
        ? `<button class="view-images-btn" onclick="openCardGallery(this)">View Images</button>`
        : "";

    return `
        <div class="cake-card" data-images='${JSON.stringify(imgs)}'>

            <div class="cake-image-section">
                <img src="${defaultImg}" alt="${item.title}">
                ${viewBtn}
            </div>

            <div class="cake-details">

                <div class="top-row">
                    <h2>${item.title}</h2>
                </div>

                ${description}

                <div class="info-table">
                    ${rows}
                </div>

            </div>

        </div>
    `;
}


function setupShowMore(containerId, gridId) {
    const grid = document.getElementById(gridId);
    const btn = document.getElementById(containerId + "-btn");

    if (!grid || !btn) return;

    const cards = grid.querySelectorAll(".cake-card");

    if (cards.length <= 1) {
        btn.style.display = "none";
        return;
    }

    let expanded = false;

    function applyLimit() {
        if (expanded) return;

        const isMobile = window.innerWidth <= 768;

        const firstCard = cards[0];
        const secondCard = cards[1];

        if (!firstCard || !secondCard) return;

        const gridRect = grid.getBoundingClientRect();
        const secondCardRect = secondCard.getBoundingClientRect();

        const firstCardHeight = firstCard.getBoundingClientRect().height;

        const visibleHeight = isMobile
            ? firstCardHeight + (firstCardHeight * 0.25)
            : firstCardHeight + (firstCardHeight * 0.25);

        grid.style.maxHeight = visibleHeight + "px";
        grid.classList.add("collapsed");
    }


    function toggleShow() {
        const scrollY = window.scrollY;

        if (grid.classList.contains("collapsed")) {
            grid.classList.remove("collapsed");
            grid.style.maxHeight = "";
            expanded = true;

            btn.innerHTML = "Show Less <span class='btn-shadow'></span>";

            window.scrollTo(0, scrollY);
        } else {
            expanded = false;

            applyLimit();

            btn.innerHTML = "Show More <span class='btn-shadow'></span>";

            btn.scrollIntoView({
                behavior: "instant",
                block: "center"
            });
        }
    }


    btn.addEventListener("click", toggleShow);

    applyLimit();

    window.addEventListener("resize", applyLimit);
}

function openCardGallery(btn) {
    const card = btn.closest(".cake-card");
    const imgs = JSON.parse(card.dataset.images || "[]");

    if (imgs.length === 0) return;

    const modal = document.getElementById("gallery");
    const content = modal.querySelector(".gallery-content");
    const closeBtn = content.querySelector(".close-btn");

    content.querySelectorAll(".cake-card-img").forEach(e => e.remove());

    imgs.forEach(src => {
        const img = document.createElement("img");

        img.src = src;
        img.className = "cake-card-img";

        content.insertBefore(img, closeBtn);
    });

    modal.classList.add("show");

    document.body.style.overflow = "hidden";
}


function loadSection(txtFile, gridId, containerId) {
    fetch(txtFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${txtFile}`);
            }

            return response.text();
        })
        .then(txt => {
            const items = parseData(txt);
            const grid = document.getElementById(gridId);

            if (!grid) return;

            grid.innerHTML = items.map(renderCard).join("");

            setupShowMore(containerId, gridId);
        })
        .catch(error => {
            console.error("Menu loading error:", error);
        });
}