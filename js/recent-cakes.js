document.addEventListener("DOMContentLoaded", async function () {

    const track = document.querySelector("#recent-cakes .marquee-track");

    if (!track) return;

    try {

        const response = await fetch("images/recent-cakes/index.json", {
            cache: "no-cache"
        });

        if (!response.ok) {
            throw new Error("Failed to load recent-cakes index");
        }

        const images = await response.json();

        if (!Array.isArray(images) || images.length === 0) {
            track.innerHTML = "";
            return;
        }

        window.recentCakeImages = images;

        const tilts = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];

        function randomTilt() {
            return tilts[Math.floor(Math.random() * tilts.length)];
        }

        function buildSet() {

            return images.map(function (filename) {

                const img = document.createElement("img");

                img.src = "images/recent-cakes/" + filename;
                img.alt = "";
                img.className = "cake-thumb";

                img.style.setProperty(
                    "--tilt",
                    randomTilt() + "deg"
                );

                return img;

            });

        }

        track.innerHTML = "";

        buildSet().forEach(img => {
            track.appendChild(img);
        });

        buildSet().forEach(img => {
            track.appendChild(img);
        });


        const recentSection = document.getElementById("recent-cakes");

        const button = document.createElement("button");

        button.className = "recent-photos-btn";
        button.textContent = "View All";

        button.addEventListener("click", openRecentCakesGallery);

        recentSection.appendChild(button);

    } catch (error) {

        console.error("Recent Cakes loading error:", error);

        track.innerHTML = "";

    }
});


function openRecentCakesGallery() {

    const images = window.recentCakeImages;

    if (!images || images.length === 0) {
        return;
    }

    const modal = document.getElementById("gallery");

    if (!modal) {
        return;
    }

    const content = modal.querySelector(".gallery-content");

    if (!content) {
        return;
    }

    const closeBtn = content.querySelector(".close-btn");

    if (!closeBtn) {
        return;
    }

    content
        .querySelectorAll(".recent-gallery-img")
        .forEach(img => img.remove());


    images.forEach(filename => {

        const img = document.createElement("img");

        img.src = "images/recent-cakes/" + filename;
        img.alt = "";
        img.className = "recent-gallery-img";
        img.loading = "lazy";

        content.insertBefore(img, closeBtn);

    });


    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}