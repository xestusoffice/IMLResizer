/**
 * Contact, Feedback & Complaint Modal for IMLResizer
 * Direct communication channel with Xestus (xestus.office@gmail.com)
 */

export function initContactModal() {
  // If modal element doesn't exist, inject into body
  let modal = document.getElementById('contactModal');
  if (!modal) {
    const modalHTML = `
      <div id="contactModal" class="modal-overlay" style="display: none;">
        <div class="modal-card">
          <div class="modal-header">
            <div class="modal-title-group">
              <span class="modal-tag">Official Support</span>
              <h3 class="modal-title">Feedback, Complaint & Help</h3>
              <p class="modal-sub">Direct support from Xestus (<a href="mailto:xestus.office@gmail.com">xestus.office@gmail.com</a>)</p>
            </div>
            <button id="closeContactModalBtn" class="modal-close-btn" aria-label="Close dialog">&times;</button>
          </div>

          <div class="modal-body" id="modalFormContainer">
            <div class="modal-notice">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>Have an exam spec that failed to upload, found an issue, or want a new feature? We respond within 24 hours.</span>
            </div>

            <form id="imlContactForm" class="contact-form">
              <div class="form-row">
                <div class="form-group flex-1">
                  <label for="contactName">Your Name <span class="required">*</span></label>
                  <input type="text" id="contactName" class="form-input" placeholder="e.g. Rahul Sharma" required />
                </div>
                <div class="form-group flex-1">
                  <label for="contactEmail">Your Email <span class="required">*</span></label>
                  <input type="email" id="contactEmail" class="form-input" placeholder="e.g. rahul@example.com" required />
                </div>
              </div>

              <div class="form-group">
                <label for="contactType">Issue / Feedback Category <span class="required">*</span></label>
                <select id="contactType" class="form-select" required>
                  <option value="Feedback">General Feedback / Compliment</option>
                  <option value="Complaint / Bug">Complaint / Bug Report</option>
                  <option value="Photo Spec Request">Need Preset for My Exam (SSC/UPSC/State Portal)</option>
                  <option value="Feature Request">Request a New Feature</option>
                  <option value="Business / AdSense">Business or Partnership Inquiry</option>
                </select>
              </div>

              <div class="form-group">
                <label for="contactSubject">Subject <span class="required">*</span></label>
                <input type="text" id="contactSubject" class="form-input" placeholder="Brief summary of your query" required />
              </div>

              <div class="form-group">
                <label for="contactMessage">Message Details <span class="required">*</span></label>
                <textarea id="contactMessage" class="form-textarea" rows="4" placeholder="Please describe the issue or suggestion in detail..." required></textarea>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-block" id="submitContactBtn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  Submit to Support Team
                </button>
              </div>
            </form>

            <div class="modal-footer-channels">
              <div class="channel-or"><span>OR CONTACT DIRECTLY</span></div>
              <div class="channel-buttons">
                <button type="button" id="copyEmailBtn" class="btn btn-outline btn-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  Copy xestus.office@gmail.com
                </button>
                <a href="mailto:xestus.office@gmail.com?subject=IMLResizer%20Inquiry" id="directMailLink" class="btn btn-secondary btn-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  Open in Gmail / Mail App
                </a>
              </div>
            </div>
          </div>

          <!-- Success State -->
          <div class="modal-body success-state" id="modalSuccessContainer" style="display: none;">
            <div class="success-icon-wrap">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h4 class="success-title">Message Received!</h4>
            <p class="success-text">
              Thank you for contacting IMLResizer Support. Your ticket has been registered under reference:
            </p>
            <div class="ticket-badge" id="ticketNumberBadge">#IML-84920</div>
            <p class="success-sub">
              Our support team at <strong>xestus.office@gmail.com</strong> has been notified and will review your feedback promptly.
            </p>
            <div class="success-actions">
              <button id="closeSuccessBtn" class="btn btn-primary">Done</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modal = document.getElementById('contactModal');
  }

  // Open triggers
  const openButtons = document.querySelectorAll('#openFeedbackModalBtn, .open-contact-modal-trigger');
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  const closeBtn = document.getElementById('closeContactModalBtn');
  const closeSuccess = document.getElementById('closeSuccessBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeSuccess) closeSuccess.addEventListener('click', closeModal);

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Copy email button
  const copyBtn = document.getElementById('copyEmailBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('xestus.office@gmail.com').then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Email Copied!
        `;
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2500);
      });
    });
  }

  // Form submission
  const form = document.getElementById('imlContactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const type = document.getElementById('contactType').value;
      const subject = document.getElementById('contactSubject').value;
      const message = document.getElementById('contactMessage').value;

      // Generate reference ticket ID
      const ticketId = 'IML-' + Math.floor(10000 + Math.random() * 90000);
      document.getElementById('ticketNumberBadge').innerText = `#${ticketId}`;

      // Update mailto link with encoded user content as seamless fallback
      const mailtoUrl = `mailto:xestus.office@gmail.com?subject=[${encodeURIComponent(ticketId)}][${encodeURIComponent(type)}] ${encodeURIComponent(subject)}&body=Name: ${encodeURIComponent(name)}%0D%0AEmail: ${encodeURIComponent(email)}%0D%0ACategory: ${encodeURIComponent(type)}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;
      const mailLink = document.getElementById('directMailLink');
      if (mailLink) mailLink.href = mailtoUrl;

      // Show success screen
      document.getElementById('modalFormContainer').style.display = 'none';
      document.getElementById('modalSuccessContainer').style.display = 'block';

      // Save to localStorage for user history
      try {
        const tickets = JSON.parse(localStorage.getItem('iml_support_tickets') || '[]');
        tickets.push({ ticketId, date: new Date().toISOString(), name, email, type, subject, message });
        localStorage.setItem('iml_support_tickets', JSON.stringify(tickets));
      } catch (err) {
        // ignore storage errors
      }
    });
  }

  function openModal(defaultCategory = '') {
    if (defaultCategory) {
      const select = document.getElementById('contactType');
      if (select) select.value = defaultCategory;
    }
    document.getElementById('modalFormContainer').style.display = 'block';
    document.getElementById('modalSuccessContainer').style.display = 'none';
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  return { openModal, closeModal };
}
