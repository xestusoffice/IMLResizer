# IMLResizer — Free Online Photo Resizer & KB Compressor
> **A flagship digital utility by [Xestus](https://xestus.in)**  
> **Official Support Desk**: [xestus.office@gmail.com](mailto:xestus.office@gmail.com)

[![Lighthouse Score](https://img.shields.io/badge/Lighthouse-100%2F100-emerald?style=for-the-badge&logo=lighthouse)](https://xestus.in)
[![Security Architecture](https://img.shields.io/badge/Privacy-100%25%20Client--Side-indigo?style=for-the-badge&logo=shield)](https://xestus.in)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 🌟 Overview

**IMLResizer** is a high-performance, privacy-first web platform engineered to resize, crop, and compress images to **exact target file sizes (20KB, 50KB, 100KB)** in **pixels, inches, cm, and mm** with **real 200 & 300 DPI metadata injection**.

Specifically tailored for candidates applying for:
* **Government & Entrance Exams**: SSC CGL/CHSL, UPSC Civil Services, NEET UG, IBPS Bank PO, State PSCs, PAN Card (NSDL/UTI).
* **International Visas & Passports**: US Visa (2x2"), Schengen Europe Visa (35x45mm), India Passport & OCI.
* **Handwritten Signatures**: Auto-enhancement to clean background paper shadows and boost pen ink to pure black on clean white.
* **Social Media & Printing**: Instagram, YouTube thumbnails, 4x6" printable passport sheets with 8 copies.

---

## 🛡️ Ironclad Security & Privacy Guarantee (Unhackable by Architecture)

Unlike traditional photo converter websites that upload users' confidential IDs, photos, and signatures to remote cloud servers, **IMLResizer runs 100% locally in the visitor's web browser**:
* **Zero Server Storage**: No images ever touch a remote server or database.
* **No Database / No Server Backend**: There is zero backend attack surface — SQL injection, remote code execution (RCE), database breaches, or unauthorized credential exposure are **architecturally impossible**.
* **Strict HTTP Security Headers**: Configured with Content Security Policy (CSP), `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, and HSTS.

---

## 🚀 Key Features

* **Exact Target Size Compression**: Smart binary-search quality algorithm guarantees images stay strictly under target limits (e.g. 18.5 - 19.5 KB for a 20 KB cap).
* **Real DPI Binary Injection**: Writes physical density markers directly to JPEG JFIF APP0 segments (`0xFFE0`) and PNG `pHYs` chunks.
* **Biometric Facial Alignment Guide**: Visual guide overlay to align eyes, chin, and crown according to official passport photo standards.
* **4x6" Printable Sheet Generator**: Generates 8 passport photo copies arranged with cutting borders on a 4x6" printable canvas.
* **Batch Multi-Image Processing**: Upload multiple files and download all processed images in a single `.zip` archive via JSZip.
* **Image to PDF Converter**: Instantly packages documents or photos into standard A4 PDF files.
* **PWA & Offline Ready**: Installable on Android and iOS home screens as a progressive web app.
* **Dark & Light Mode**: Seamless theme toggle with local memory.

---

## 🌐 Subdomain & DNS Setup Guide for `xestus.in`

To host IMLResizer live under your domain (e.g. `https://resizer.xestus.in` or `https://imlresizer.xestus.in`):

### Option A: 1-Click Deployment via Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New Project** and select `xestusoffice/IMLResizer`.
3. Build Settings:
   * **Framework Preset**: Vite
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Click **Deploy**.
5. In your Vercel Project Settings > **Domains**, enter: `resizer.xestus.in`.
6. Add the CNAME record in your DNS provider (Cloudflare, GoDaddy, or Namecheap):
   * **Type**: `CNAME`
   * **Name**: `resizer`
   * **Target**: `cname.vercel-dns.com`

---

### Option B: Cloudflare Pages (Free & Ultra Fast)
1. In Cloudflare Dashboard, go to **Workers & Pages** > **Create application** > **Pages**.
2. Connect `xestusoffice/IMLResizer`.
3. Set build command `npm run build` and output directory `dist`.
4. Under Custom Domains, add `resizer.xestus.in` (Cloudflare automatically routes and activates SSL with 1 click!).

---

### Option C: Traditional cPanel Hosting
1. Build the production bundle locally:
   ```bash
   npm run build
   ```
2. Upload all files from the `dist/` folder into your cPanel `public_html/resizer/` directory.

---

## 💰 Google AdSense & SEO Optimization

1. **Pre-configured Responsive Ad Slots**:
   * Top Leaderboard (`728x90` / auto)
   * Mid-Content In-Article Unit
2. **AdSense Activation**:
   In `index.html` (and other pages), uncomment and paste your publisher script:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```
3. **Google Search Console Indexing**:
   Submit your sitemap directly at:
   `https://resizer.xestus.in/sitemap.xml`

---

## 📩 Support & Inquiries

* **Entity**: Xestus Technologies ([xestus.in](https://xestus.in))
* **Official Support Email**: [xestus.office@gmail.com](mailto:xestus.office@gmail.com)
* **Feedback Portal**: Accessible on any page via the **Feedback** button.
