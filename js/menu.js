/*
 * Image gallery (shared by "View More Photos" and "Recent Bakes > View All").
 *
 * Back-gesture handling:
 * Opening the gallery adds ONE history entry. The phone's back gesture / back
 * button then pops that entry and closes the gallery instead of leaving the
 * site. Closing with the X button (or Esc / tapping the dark backdrop) removes
 * that entry again, so history never piles up.
 */
let galleryHistoryPushed = false;

function getGalleryModal() {
    return document.getElementById("gallery");
}

function isGalleryOpen() {
    const modal = getGalleryModal();
    return !!modal && modal.classList.contains("show");
}

function openGallery() {
    const modal = getGalleryModal();
    if (!modal || isGalleryOpen()) return;

    modal.classList.add("show");
    document.body.style.overflow = "hidden";

    const content = modal.querySelector(".gallery-content");
    if (content) content.scrollTop = 0;

    if (!galleryHistoryPushed) {
        history.pushState({ gallery: true }, "", location.href);
        galleryHistoryPushed = true;
    }
}

function hideGallery() {
    const modal = getGalleryModal();
    if (!modal) return;

    modal.querySelectorAll(".cake-card-img, .recent-gallery-img").forEach(e => e.remove());
    modal.classList.remove("show");
    document.body.style.overflow = "";
}

function closeGallery() {
    if (!isGalleryOpen()) return;

    hideGallery();

    // Remove the history entry we added when opening. The resulting popstate
    // event finds the gallery already closed and does nothing.
    if (galleryHistoryPushed) {
        galleryHistoryPushed = false;
        history.back();
    }
}

// Phone back gesture / browser back button: close the gallery, stay on the site.
window.addEventListener("popstate", function () {
    if (isGalleryOpen()) {
        galleryHistoryPushed = false;
        hideGallery();
    }
});

// Esc key closes the gallery.
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeGallery();
});

// Tapping the dark area outside the white panel closes the gallery.
document.addEventListener("click", function (event) {
    const modal = getGalleryModal();
    if (modal && event.target === modal) closeGallery();
});

// If the page was reloaded while a gallery entry was current, clear the stale marker.
if (history.state && history.state.gallery) {
    history.replaceState(null, "", location.href);
}
