const fs = require("fs");
const path = require("path");

const folder = path.join(__dirname, "images", "recent-cakes");
const output = path.join(folder, "index.json");

const allowedExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif"
];

const files = fs
    .readdirSync(folder)
    .filter(file => {
        const ext = path.extname(file).toLowerCase();

        return (
            allowedExtensions.includes(ext) &&
            file.toLowerCase() !== "index.json"
        );
    })
    .sort((a, b) => a.localeCompare(b));

fs.writeFileSync(
    output,
    JSON.stringify(files, null, 4),
    "utf8"
);

console.log(`Generated ${files.length} recent cake images.`);