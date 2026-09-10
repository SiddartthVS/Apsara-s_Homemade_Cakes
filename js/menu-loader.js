const MENU_SECTIONS = [
    { name: "classics", file: "data/classics.txt", grid: "classics-grid", button: "classics-btn" },
    { name: "brownies", file: "data/brownies.txt", grid: "brownies-grid", button: "brownies-btn" },
    { name: "premium", file: "data/premium.txt", grid: "premium-grid", button: "premium-btn" },
    { name: "themed", file: "data/themed.txt", grid: "themed-grid", button: "themed-btn" },
    { name: "specials", file: "data/specials.txt", grid: "specials-grid", button: "specials-btn" }
];

function parseData(txt) {
    return txt.split(/\n\s*\n/).map(block => {
        const lines = block.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        if (lines.length === 0) return null;

        const item = { title: lines[0], images: [], badges: [], description: "", info: [] };

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];

            if (/^IMAGES\s*:/i.test(line)) {
                item.images = line.replace(/^IMAGES\s*:/i, "").split(",").map(s => s.trim()).filter(Boolean);
                continue;
            }

            const priceMatch = line.match(/^(.*?)\s*-\s*(₹\s*[\d,]+(?:\.\d+)?)\s*$/);
            if (priceMatch) {
                let label = priceMatch[1].trim();
                const price = priceMatch[2].trim();
                const badgeMatch = label.match(/\(([^()]*)\)\s*$/);
                let rowBadges = [];

                if (badgeMatch) {
                    rowBadges = badgeMatch[1].split("|").map(badge => badge.trim()).filter(Boolean);
                    label = label.replace(/\s*\([^()]*\)\s*$/, "").trim();
                }

                item.info.push({ label, badges: rowBadges, price });
                continue;
            }

            if (!item.description) item.description = line;
        }
        return item;
    }).filter(Boolean);
}

function getCloudinaryImageUrl(filename, width = 700) {
    const publicId = filename.trim().replace(/\.[^/.]+$/, "");
    return `https://res.cloudinary.com/qreur6ez/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderCard(item) {
    const imgs = (item.images || []).map(image => getCloudinaryImageUrl(image));
    const defaultImg = imgs[0] || "images/assets/logo.png";
    const description = item.description ? `<p class="card-description">${escapeHTML(item.description)}</p>` : "";

    const rows = (item.info || []).map(row => {
        const rowBadges = (row.badges || []).map(badge => `<span class="row-badge">${escapeHTML(badge)}</span>`).join("");
        return `
            <div class="info-row">
                <div class="info-label">
                    <span class="info-name">${escapeHTML(row.label)}</span>
                    ${rowBadges ? `<span class="row-badges">${rowBadges}</span>` : ""}
                </div>
                <span class="price">${escapeHTML(row.price)}</span>
            </div>
        `;
    }).join("");

    const viewBtn = imgs.length > 1 ? `<button class="view-images-btn" onclick="openCardGallery(this)">View More Photos</button>` : "";

    return `
        <div class="cake-card" data-images='${JSON.stringify(imgs)}'>
            <div class="cake-image-section">
                <img src="${defaultImg}" alt="${escapeHTML(item.title)}" loading="lazy">
                ${viewBtn}
            </div>
            <div class="cake-details">
                <div class="top-row">
                    <h2>${escapeHTML(item.title)}</h2>
                </div>
                ${description}
                <div class="info-table">
                    ${rows}
                </div>
            </div>
        </div>
    `;
}

function setupShowMore(gridId, buttonId) {
    const grid = document.getElementById(gridId);
    const btn = document.getElementById(buttonId);
    if (!grid || !btn) return;

    let expanded = false;

    function applyLimit() {

        if (expanded) return;
        const cards = Array.from(grid.querySelectorAll(".cake-card"));

        if (cards.length <= 1) {
            btn.style.display = "none";
            grid.classList.remove("collapsed");
            grid.style.maxHeight = "";
            return;
        }

        btn.style.display = "";
        const firstCard = cards[0];
        if (!firstCard) return;

        const firstCardHeight = firstCard.getBoundingClientRect().height;
        const visibleHeight = firstCardHeight + 20;
        grid.style.maxHeight = visibleHeight + "px";
        grid.classList.add("collapsed");
        btn.innerHTML = 'Show More <span class="btn-shadow"></span>';
    }

    function toggleShow() {
        const scrollY = window.scrollY;
        if (grid.classList.contains("collapsed")) {
            grid.classList.remove("collapsed");
            grid.style.maxHeight = "";
            expanded = true;
            btn.innerHTML = 'Show Less <span class="btn-shadow"></span>';
            window.scrollTo(0, scrollY);
        } else {
            expanded = false;
            applyLimit();
            btn.innerHTML = 'Show More <span class="btn-shadow"></span>';
            btn.scrollIntoView({ behavior: "instant", block: "center" });
        }
    }

    btn.addEventListener("click", toggleShow);
    applyLimit();
    window.addEventListener("resize", function () {
        if (!expanded) applyLimit();
    });
}

function openCardGallery(btn) {
    const card = btn.closest(".cake-card");
    if (!card) return;

    const imgs = JSON.parse(card.dataset.images || "[]");
    if (!imgs.length) return;

    const modal = document.getElementById("gallery");
    if (!modal) return;

    const content = modal.querySelector(".gallery-content");
    if (!content) return;

    const closeBtn = content.querySelector(".close-btn");
    content.querySelectorAll(".cake-card-img").forEach(img => img.remove());

    imgs.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.className = "cake-card-img";
        img.loading = "lazy";
        content.insertBefore(img, closeBtn);
    });

    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}

async function loadSection(section) {
    const grid = document.getElementById(section.grid);
    if (!grid) return;

    try {
        const response = await fetch(section.file, { cache: "no-cache" });
        if (!response.ok) throw new Error(`Failed to load ${section.file}`);

        const txt = await response.text();
        const items = parseData(txt);

        grid.innerHTML = items.map(renderCard).join("");
        setupShowMore(section.grid, section.button);
    } catch (error) {
        console.error(`Menu section "${section.name}" could not be loaded:`, error);
        grid.innerHTML = "";
        const button = document.getElementById(section.button);
        if (button) button.style.display = "none";
    }
}

async function initializeMenu() {
    await Promise.all(MENU_SECTIONS.map(section => loadSection(section)));
}