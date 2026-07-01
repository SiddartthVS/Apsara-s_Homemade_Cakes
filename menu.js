function openGallery() {
    document.getElementById("gallery").classList.add("show");
}

function closeGallery() {
    const modal = document.getElementById("gallery");
    modal.querySelectorAll(".cake-card-img").forEach(e => e.remove());
    modal.classList.remove("show");
}