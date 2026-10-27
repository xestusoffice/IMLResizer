/**
 * Universal Navigation Bar for IMLResizer
 */

import logoUrl from '../assets/logo.png';

export function renderNavbar(activePage = '') {
  const navContainer = document.getElementById('navbar-mount') || document.querySelector('header');
  if (!navContainer) return;

  const currentTheme = localStorage.getItem('iml_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  navContainer.innerHTML = `
    <nav class="site-nav">
      <div class="nav-container">
        <!-- Logo -->
        <a href="index.html" class="nav-logo">
          <div class="logo-icon">
            <img src="${logoUrl}" alt="IMLResizer Logo" class="brand-logo-img" width="42" height="42" />
          </div>
          <div class="logo-text">
            <span class="logo-brand">IMLResizer</span>
            <span class="logo-tag">by XESTUS</span>
          </div>
        </a>

        <!-- Desktop Links -->
        <div class="nav-links">
          <div class="nav-dropdown">
            <button class="nav-link dropdown-toggle" id="toolsDropdownBtn">
              All Tools
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="dropdown-menu">
              <a href="resize-image-to-20kb.html" class="dropdown-item ${activePage === '20kb' ? 'active' : ''}">
                <span class="item-title">Resize to 20 KB</span>
                <span class="item-desc">For SSC, UPSC, Job forms & signatures</span>
              </a>
              <a href="resize-image-to-50kb.html" class="dropdown-item ${activePage === '50kb' ? 'active' : ''}">
                <span class="item-title">Resize to 50 KB</span>
                <span class="item-desc">For entrance exams & admission forms</span>
              </a>
              <a href="resize-image-to-100kb.html" class="dropdown-item ${activePage === '100kb' ? 'active' : ''}">
                <span class="item-title">Resize to 100 KB</span>
                <span class="item-desc">For portal uploads & certificates</span>
              </a>
              <div class="dropdown-divider"></div>
              <a href="passport-photo-maker.html" class="dropdown-item ${activePage === 'passport' ? 'active' : ''}">
                <span class="item-title">Passport & Visa Photo</span>
                <span class="item-desc">US, Schengen, India + 4x6 print sheet</span>
              </a>
              <a href="signature-resizer.html" class="dropdown-item ${activePage === 'signature' ? 'active' : ''}">
                <span class="item-title">Signature Resizer & B&W</span>
                <span class="item-desc">Clean paper shadows & enhance ink</span>
              </a>
              <a href="image-compressor.html" class="dropdown-item ${activePage === 'compressor' ? 'active' : ''}">
                <span class="item-title">Smart Compressor</span>
                <span class="item-desc">Batch reduce image size in KB/MB</span>
              </a>
              <a href="convert-to-pdf.html" class="dropdown-item ${activePage === 'topdf' ? 'active' : ''}">
                <span class="item-title">Image to PDF</span>
                <span class="item-desc">Convert single or multiple images to PDF</span>
              </a>
            </div>
          </div>

          <a href="resize-image-to-20kb.html" class="nav-link ${activePage === '20kb' ? 'active' : ''}">Resize to 20KB</a>
          <a href="resize-image-to-50kb.html" class="nav-link ${activePage === '50kb' ? 'active' : ''}">Resize to 50KB</a>
          <a href="passport-photo-maker.html" class="nav-link ${activePage === 'passport' ? 'active' : ''}">Passport Photo</a>
          <a href="contact.html" class="nav-link ${activePage === 'contact' ? 'active' : ''}">Feedback & Help</a>
        </div>

        <!-- Right actions -->
        <div class="nav-actions">
          <button id="themeToggleBtn" class="theme-toggle-btn" title="Toggle dark/light theme" aria-label="Toggle theme">
            <span class="theme-icon light-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </span>
            <span class="theme-icon dark-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </span>
          </button>

          <button id="openFeedbackModalBtn" class="btn btn-outline btn-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>Feedback</span>
          </button>

          <!-- Mobile Hamburger -->
          <button id="mobileMenuBtn" class="mobile-menu-btn" aria-label="Open navigation menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Drawer Menu -->
      <div id="mobileDrawer" class="mobile-drawer">
        <div class="mobile-drawer-content">
          <div class="drawer-header">
            <span class="drawer-title">Menu</span>
            <button id="closeDrawerBtn" class="btn-icon" aria-label="Close menu">&times;</button>
          </div>
          <div class="drawer-links">
            <a href="index.html" class="drawer-link ${activePage === 'home' ? 'active' : ''}">All In One Resizer</a>
            <a href="resize-image-to-20kb.html" class="drawer-link ${activePage === '20kb' ? 'active' : ''}">Resize to 20 KB</a>
            <a href="resize-image-to-50kb.html" class="drawer-link ${activePage === '50kb' ? 'active' : ''}">Resize to 50 KB</a>
            <a href="resize-image-to-100kb.html" class="drawer-link ${activePage === '100kb' ? 'active' : ''}">Resize to 100 KB</a>
            <a href="passport-photo-maker.html" class="drawer-link ${activePage === 'passport' ? 'active' : ''}">Passport & Visa Photo</a>
            <a href="signature-resizer.html" class="drawer-link ${activePage === 'signature' ? 'active' : ''}">Signature Resizer</a>
            <a href="image-compressor.html" class="drawer-link ${activePage === 'compressor' ? 'active' : ''}">Smart Compressor</a>
            <a href="convert-to-pdf.html" class="drawer-link ${activePage === 'topdf' ? 'active' : ''}">Image to PDF</a>
            <hr class="drawer-divider"/>
            <a href="contact.html" class="drawer-link ${activePage === 'contact' ? 'active' : ''}">Contact / Complaint</a>
            <a href="privacy-policy.html" class="drawer-link">Privacy Policy</a>
            <a href="about.html" class="drawer-link">About Xestus</a>
          </div>
        </div>
      </div>
    </nav>
  `;

  // Attach navbar events
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('iml_theme', next);
    });
  }

  const mobileBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('closeDrawerBtn');
  const drawer = document.getElementById('mobileDrawer');

  if (mobileBtn && drawer) {
    mobileBtn.addEventListener('click', () => drawer.classList.add('open'));
  }
  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => drawer.classList.remove('open'));
  }
}
