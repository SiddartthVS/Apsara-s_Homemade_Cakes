function parseData(txt) {
    return txt.split("---").map(block => {
        block = block.trim();
        if (!block) return null;
        const lines = block.split("\n");
        const item = {};
        lines.forEach(line => {
            const [key, ...rest] = line.split(":");
            if (!key || rest.length === 0) return;
            const k = key.trim().toLowerCase();
            const v = rest.join(":").trim();
            if (k === "title") item.title = v;
            else if (k === "images") item.images = v.split(",").map(s => s.trim()).filter(Boolean);
            else if (k === "badges") item.badges = v.split(",").map(s => s.trim()).filter(Boolean);
            else if (k === "info") item.info = v.split(",").map(s => {
                const p = s.trim().split("-");
                return { label: p[0]?.trim() || "", price: p.slice(1).join("-").trim() || "" };
            }).filter(i => i.label);
        });
        return item;
    }).filter(Boolean);
}

function renderCard(item, folder) {
    const imgs = (item.images || []).map(i => `menu/${folder}/${i}`);
    const defaultImg = imgs[0] || "https://picsum.photos/400/400";
    const badges = (item.badges || []).map(b => `<span>${b}</span>`).join("");
    const rows = (item.info || []).map(r =>
        `<div class="info-row"><span>${r.label}</span><span style="font-weight:700;">${r.price}</span></div>`
    ).join("");

    const viewBtn = imgs.length > 1 ? `<button class="view-images-btn" onclick="openCardGallery(this)">View Images</button>` : "";

    return `<div class="cake-card" data-images='${JSON.stringify(imgs)}'>
        <div class="cake-image-section">
            <img src="${defaultImg}" alt="${item.title}">
            ${viewBtn}
        </div>
        <div class="cake-details">
            <div class="top-row"><h2>${item.title}</h2></div>
            <div class="badges">${badges}</div>
            <div class="info-table">${rows}</div>
        </div>
    </div>`;
}

function setupShowMore(containerId, gridId) {
    const grid = document.getElementById(gridId);
    const btn = document.getElementById(containerId + "-btn");
    if (!grid || !btn) return;

    const cards = grid.querySelectorAll(".cake-card");
    if (cards.length <= 4) { btn.style.display = "none"; return; }

    function applyLimit() {
        const isMobile = window.innerWidth <= 768;
        const limit = isMobile ? 2 : 4;
        cards.forEach((c, i) => {
            if (i >= limit) c.classList.add("cake-hidden");
            else c.classList.remove("cake-hidden");
        });
    }

    function toggleShow() {
        const isHidden = grid.querySelector(".cake-hidden");
        if (isHidden) {
            cards.forEach(c => c.classList.remove("cake-hidden"));
            btn.innerHTML = "Show Less <span class='btn-shadow'></span>";
        } else {
            applyLimit();
            btn.innerHTML = "Show More <span class='btn-shadow'></span>";
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
}

function loadSection(txtFile, gridId, containerId, folder) {
    fetch(txtFile)
        .then(r => r.text())
        .then(txt => {
            const items = parseData(txt);
            const grid = document.getElementById(gridId);
            if (!grid) return;
            grid.innerHTML = items.map(item => renderCard(item, folder)).join("");
            setupShowMore(containerId, gridId);
        })
        .catch(() => {});
}
