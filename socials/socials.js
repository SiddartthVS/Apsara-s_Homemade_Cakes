async function loadSocialLinks() {
    const text = await (await fetch("socials/socials.txt")).text();

    const links = {};

    text.split("\n").forEach(line => {
        const [key, value] = line.split("=");

        if (key && value) {
            links[key.trim()] = value.trim();
        }
    });

    document.querySelectorAll("[data-social]").forEach(anchor => {
        const social = anchor.dataset.social;

        if (links[social]) {
            anchor.href = links[social];
        }
    });
}

loadSocialLinks();

const socials = document.querySelector('.social-container');

const home = document.querySelector('#home');
const contact = document.querySelector('#contact');

const observer = new IntersectionObserver((entries) => {

    let centered = false;

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            centered = true;
        }
    });

    if (centered) {
        socials.classList.remove('top-mode');
        socials.classList.add('center-mode');
    } else {
        socials.classList.remove('center-mode');
        socials.classList.add('top-mode');
    }

}, {
    threshold: 0.3
});

observer.observe(home);
observer.observe(contact);