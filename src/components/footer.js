/**
 * Universal Footer for IMLResizer
 * Includes AdSense legal compliance links, privacy guarantee, and Xestus company info.
 */

export function renderFooter() {
  const footerContainer = document.getElementById('footer-mount') || document.querySelector('footer');
  if (!footerContainer) return;

  footerContainer.innerHTML = `
    <footer class="site-footer">
      <div class="footer-top-banner">
        <div class="container footer-banner-content">
          <div class="banner-privacy-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 11 14 15 10"></polyline>
            </svg>
            <div>
              <strong>100% Client-Side Privacy Guaranteed</strong>
              <p>Your photos, signatures, and IDs are never uploaded to any server. Everything is processed directly in your web browser.</p>
            </div>
          </div>
          <div class="banner-contact-fast">
            <span>Need Help or Found a Bug?</span>
            <a href="mailto:xestus.office@gmail.com" class="banner-email-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              xestus.office@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div class="container footer-main">
        <div class="footer-grid">
          <!-- Column 1: Brand Info -->
          <div class="footer-col brand-col">
            <div class="footer-brand">
              <span class="brand-title">IMLResizer</span>
              <span class="brand-sub">by Xestus (<a href="https://xestus.in" target="_blank" rel="noopener">xestus.in</a>)</span>
            </div>
            <p class="brand-desc">
              The premier free online photo resizer and image compressor designed specifically for government exam registrations, visa & passport applications, and social media.
            </p>
            <div class="company-info-box">
              <div class="info-row">
                <span class="info-label">Parent:</span>
                <span class="info-val">Xestus Technologies</span>
              </div>
              <div class="info-row">
                <span class="info-label">Website:</span>
                <a href="https://xestus.in" target="_blank" rel="noopener" class="info-val link">xestus.in</a>
              </div>
              <div class="info-row">
                <span class="info-label">Support Email:</span>
                <a href="mailto:xestus.office@gmail.com" class="info-val link">xestus.office@gmail.com</a>
              </div>
            </div>
          </div>

          <!-- Column 2: Popular Tools -->
          <div class="footer-col">
            <h4 class="footer-heading">Online Tools</h4>
            <ul class="footer-list">
              <li><a href="resize-image-to-20kb.html">Resize Image to 20 KB</a></li>
              <li><a href="resize-image-to-50kb.html">Resize Image to 50 KB</a></li>
              <li><a href="resize-image-to-100kb.html">Resize Image to 100 KB</a></li>
              <li><a href="passport-photo-maker.html">Passport & Visa Photo Maker</a></li>
              <li><a href="signature-resizer.html">Signature Resizer & B&W Enhancer</a></li>
              <li><a href="image-compressor.html">Smart Image Compressor</a></li>
              <li><a href="convert-to-pdf.html">Image to PDF Converter</a></li>
            </ul>
          </div>

          <!-- Column 3: Exam Presets -->
          <div class="footer-col">
            <h4 class="footer-heading">Exam & Visa Presets</h4>
            <ul class="footer-list">
              <li><a href="resize-image-to-20kb.html#ssc">SSC CGL / CHSL (3.5x4.5 cm)</a></li>
              <li><a href="resize-image-to-50kb.html#upsc">UPSC Civil Services Photo</a></li>
              <li><a href="passport-photo-maker.html#us-visa">US Visa (2x2 Inches)</a></li>
              <li><a href="passport-photo-maker.html#schengen">Schengen Europe Visa</a></li>
              <li><a href="signature-resizer.html#pan">PAN Card Photo & Signature</a></li>
              <li><a href="passport-photo-maker.html#sheet">4x6 Printable Passport Sheet</a></li>
            </ul>
          </div>

          <!-- Column 4: Trust & Legal -->
          <div class="footer-col">
            <h4 class="footer-heading">Company & Legal</h4>
            <ul class="footer-list">
              <li><a href="about.html">About Us</a></li>
              <li><a href="contact.html">Contact & Complaints</a></li>
              <li><a href="privacy-policy.html">Privacy Policy</a></li>
              <li><a href="terms.html">Terms of Service</a></li>
              <li><a href="contact.html?type=feedback">Submit Feedback</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="copyright-text">
            &copy; ${new Date().getFullYear()} <strong>IMLResizer</strong>. An official product of <strong>Xestus</strong> (<a href="https://xestus.in" target="_blank" rel="noopener">xestus.in</a>). All rights reserved.
          </p>
          <div class="footer-badges">
            <span class="pill-badge">Zero Server Storage</span>
            <span class="pill-badge">Free Forever</span>
            <span class="pill-badge">GDPR & CCPA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}
