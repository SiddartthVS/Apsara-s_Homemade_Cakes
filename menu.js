function openGallery() {
    document.getElementById("gallery").classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeGallery() {
    const modal = document.getElementById("gallery");
    modal.querySelectorAll(".cake-card-img").forEach(e => e.remove());
    modal.classList.remove("show");
    document.body.style.overflow = "";
}