<h1 align="center">Apsara's Homemade Cakes 🍰</h1>

<div align="center">
  <a href="https://apsara-shomemadecakes.vercel.app"><strong>View Live Website</strong></a>
</div>
<br>

A responsive, high-performance landing page and digital menu built for a home bakery business. Designed to showcase custom cakes, live offers, and detailed menu items with a warm, inviting aesthetic.

## 🚀 Features

*   **Fully Responsive UI:** Seamlessly adapts to desktop, tablet, and mobile screens.
*   **Dynamic Sections:** Includes interactive categories for Classics, Brownies, Premium, Themed, and Special cakes.
*   **Zero-Dependency Frontend:** Built with pure HTML, CSS, and Vanilla JavaScript for maximum performance and complete styling control without the bloat of heavy frameworks.
*   **Automated Gallery Generation:** Features a custom Node.js build script that automatically detects new images in the repository and generates a JSON index for the frontend, eliminating the need for a traditional database.
*   **Optimized Image Delivery:** Integrated with Cloudinary for fast, auto-formatted, and compressed image loading.

## 🛠️ Tech Stack

*   **Frontend:** HTML5, CSS3 (Custom Variables, Flexbox, Grid), Vanilla JavaScript
*   **Build Tools:** Node.js (File system automation)
*   **Deployment:** Vercel

## ⚙️ How the Automated Build Works

To avoid manually updating arrays or maintaining a database every time a new cake photo is uploaded, this project utilizes a pre-build script (`js/generate-recent-cakes.cjs`). 

During the Vercel deployment pipeline, this script:
1. Scans the `images/recent-cakes` directory.
2. Filters for valid image extensions (`.jpg`, `.png`, `.webp`, etc.).
3. Generates a fresh `index.json` file.
4. The frontend fetches this JSON on page load to dynamically render the "Recent Bakes" marquee and image gallery.
