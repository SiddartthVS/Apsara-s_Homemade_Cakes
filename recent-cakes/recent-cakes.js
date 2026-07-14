document.addEventListener("DOMContentLoaded", function () {
    var track = document.querySelector("#recent-cakes .marquee-track");
    if (!track) return;

    var images = [
        "offer1.jpg",
        "offer2.jpg",
        "offer4.jpg",
        "velvet1.jpg",
        "velvet2.jpg",
        "walnut1.jpg",
        "walnut2.jpg",
        "walnut3.jpg"
    ];

    var tilts = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
    function randomTilt() {
        return tilts[Math.floor(Math.random() * tilts.length)];
    }

    function buildSet(imgs) {
        return imgs.map(function (src) {
            var t = randomTilt();
            return '<img src="recent-cakes/' + src + '" alt="" class="cake-thumb" style="--tilt:' + t + 'deg">';
        }).join("\n");
    }

    track.innerHTML = buildSet(images) + "\n" + buildSet(images);
});
