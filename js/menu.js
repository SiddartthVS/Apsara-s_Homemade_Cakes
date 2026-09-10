function openGallery() {
    const modal = document.getElementById("gallery");
    if (!modal) return;

    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeGallery() {
    const modal = document.getElementById("gallery");
    if (!modal) return;

    modal.querySelectorAll(".cake-card-img, .recent-gallery-img").forEach(e => e.remove());
    modal.classList.remove("show");
    document.body.style.overflow = "";
}