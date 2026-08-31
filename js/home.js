window.addEventListener("scroll", () => {

    const nav = document.querySelector(".aps-menu-nav");
    const socials = document.querySelector(".social-container");
    const home = document.querySelector("#home");

    if (window.scrollY > home.offsetHeight - 100) {

        nav.classList.add("aps-sticky");

        socials.classList.remove("center-mode");
        socials.classList.add("top-mode");

    } else {

        nav.classList.remove("aps-sticky");

        socials.classList.remove("top-mode");
        socials.classList.add("center-mode");
    }

});