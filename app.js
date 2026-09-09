/**
 * Zoom Cards – Palakkad
 * Interactive Application Scripts
 * --------------------------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Interactive Wedding Card Cost Estimator
     ========================================================================== */

  // Card Style Metadata
  const CARD_STYLES = {
    traditional: { name: 'Traditional Kerala Fold', basePrice: 18 },
    lasercut:    { name: 'Intricate Laser Cut', basePrice: 35 },
    royalbox:    { name: 'Royal Box Invitation', basePrice: 65 },
    minimalist:  { name: 'Modern Minimalist Floral', basePrice: 22 },
    acrylic:     { name: 'Luxury Acrylic & Hardbound', basePrice: 85 }
  };

  // DOM Elements for Estimator
  const styleRadios = document.querySelectorAll('input[name="cardStyle"]');
  const styleCardLabels = document.querySelectorAll('.style-card');
  const quantityRange = document.getElementById('quantityRange');
  const quantityValue = document.getElementById('quantityValue');
  const addonCheckboxes = document.querySelectorAll('.addon-checkbox input[type="checkbox"]');

  // Summary Display Elements
  const summarySelectedStyle = document.getElementById('summarySelectedStyle');
  const summarySelectedQty = document.getElementById('summarySelectedQty');
  const summaryBaseRate = document.getElementById('summaryBaseRate');
  const summaryAddonRate = document.getElementById('summaryAddonRate');
  const summaryDiscount = document.getElementById('summaryDiscount');
  const summaryEffectiveRate = document.getElementById('summaryEffectiveRate');
  const summaryTotalAmount = document.getElementById('summaryTotalAmount');
  const depositAdvance = document.getElementById('depositAdvance');
  const depositFinal = document.getElementById('depositFinal');
  const whatsappQuoteBtn = document.getElementById('whatsappQuoteBtn');
  const printQuoteBtn = document.getElementById('printQuoteBtn');

  /**
   * Calculate bulk discount percentage based on quantity
   */
  function getBulkDiscount(qty) {
    if (qty >= 1000) return 0.15; // 15% discount for 1000+
    if (qty >= 750)  return 0.12; // 12% discount
    if (qty >= 500)  return 0.10; // 10% discount
    if (qty >= 250)  return 0.05; // 5% discount
    return 0.00; // Standard rate for 100-249
  }

  /**
   * Recalculate quote live
   */
  function updateEstimator() {
    // 1. Selected Style
    let selectedStyleKey = 'traditional';
    styleRadios.forEach(radio => {
      if (radio.checked) {
        selectedStyleKey = radio.value;
      }
    });

    const styleData = CARD_STYLES[selectedStyleKey] || CARD_STYLES.traditional;

    // Update active style card visual class
    styleCardLabels.forEach(label => {
      const radio = label.querySelector('input[type="radio"]');
      if (radio && radio.checked) {
        label.classList.add('selected');
      } else {
        label.classList.remove('selected');
      }
    });

    // 2. Quantity
    const qty = parseInt(quantityRange.value, 10) || 300;
    quantityValue.textContent = qty.toLocaleString();

    // 3. Add-ons
    let totalAddonPerCard = 0;
    const selectedAddonNames = [];
    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        const val = parseFloat(cb.value) || 0;
        totalAddonPerCard += val;
        const textNode = cb.closest('.addon-checkbox')?.querySelector('strong');
        if (textNode) selectedAddonNames.push(textNode.textContent.trim());
      }
    });

    // 4. Base & Discount
    const baseCardPrice = styleData.basePrice;
    const discountFraction = getBulkDiscount(qty);
    const subtotalPerCard = baseCardPrice + totalAddonPerCard;
    const discountedPerCard = subtotalPerCard * (1 - discountFraction);

    // 5. Total and 60/40 Split
    const totalEstimate = Math.round(discountedPerCard * qty);
    const advanceAmount = Math.round(totalEstimate * 0.60);
    const finalAmount = totalEstimate - advanceAmount;

    // 6. Card Printing Press (Tharekkad)
    const pressLocation = 'Tharekkad Card Printing Press (Near Ninan Complex, Palakkad)';

    // 7. Update UI Values
    if (summarySelectedStyle) summarySelectedStyle.textContent = styleData.name;
    if (summarySelectedQty) summarySelectedQty.textContent = `${qty.toLocaleString()} Cards`;
    if (summaryBaseRate) summaryBaseRate.textContent = `₹${baseCardPrice.toFixed(2)} / card`;
    if (summaryAddonRate) summaryAddonRate.textContent = `+₹${totalAddonPerCard.toFixed(2)} / card`;

    if (summaryDiscount) {
      if (discountFraction > 0) {
        summaryDiscount.textContent = `-${Math.round(discountFraction * 100)}% direct press discount`;
        summaryDiscount.className = 'text-success';
      } else {
        summaryDiscount.textContent = 'Standard rate';
        summaryDiscount.className = 'text-muted';
      }
    }

    if (summaryEffectiveRate) summaryEffectiveRate.textContent = `₹${discountedPerCard.toFixed(2)}`;
    if (summaryTotalAmount) summaryTotalAmount.textContent = `₹${totalEstimate.toLocaleString()}`;
    if (depositAdvance) depositAdvance.textContent = `₹${advanceAmount.toLocaleString()}`;
    if (depositFinal) depositFinal.textContent = `₹${finalAmount.toLocaleString()}`;

    // 8. Update WhatsApp Quote URL
    if (whatsappQuoteBtn) {
      const addonsList = selectedAddonNames.length > 0 ? selectedAddonNames.join(', ') : 'None';
      const message = 
        `Hello Zoom Cards Printing Press (Tharekkad, Palakkad),\n\n` +
        `I generated an invitation estimate on your website:\n` +
        `• Card Style: ${styleData.name}\n` +
        `• Quantity: ${qty} Cards\n` +
        `• Custom Add-ons: ${addonsList}\n` +
        `• Rate per Card: ₹${discountedPerCard.toFixed(2)}\n` +
        `• Estimated Budget: ₹${totalEstimate.toLocaleString()} (60% Booking: ₹${advanceAmount.toLocaleString()} / 40% Handover: ₹${finalAmount.toLocaleString()})\n` +
        `• Printing Press Location: ${pressLocation}\n` +
        `• Service: Custom Card Designing & Direct Press Printing\n` +
        `• Payment Mode: UPI / Cash\n\n` +
        `Please let me know when I can visit the Tharekkad press to review design proofs and confirm our order. Thank you!`;

      whatsappQuoteBtn.onclick = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
      };
    }
  }

  // Bind Estimator Event Listeners
  styleRadios.forEach(radio => radio.addEventListener('change', updateEstimator));
  if (quantityRange) quantityRange.addEventListener('input', updateEstimator);
  addonCheckboxes.forEach(cb => cb.addEventListener('change', updateEstimator));

  if (printQuoteBtn) {
    printQuoteBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Initial Calculation
  updateEstimator();

  /* ==========================================================================
     2. Service Category Filter Tabs
     ========================================================================== */

  const filterTabs = document.querySelectorAll('.filter-tab');
  const serviceCards = document.querySelectorAll('.service-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  /* ==========================================================================
     3. FAQ Accordion
     ========================================================================== */

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for neat accordion behavior
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBtn = otherItem.querySelector('.faq-question');
        const otherIcon = otherItem.querySelector('.faq-icon');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherIcon) otherIcon.textContent = '+';
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        const icon = item.querySelector('.faq-icon');
        if (icon) icon.textContent = '−';
      }
    });
  });

  /* ==========================================================================
     4. Interactive Enquiry Modal
     ========================================================================== */

  const enquiryModal = document.getElementById('enquiryModal');
  const openEnquiryBtn = document.getElementById('openEnquiryModalBtn');
  const bottomEnquireBtn = document.getElementById('bottomEnquireBtn');
  const studioBookVisitBtn = document.getElementById('studioBookVisitBtn');
  const closeEnquiryBtn = document.getElementById('closeEnquiryModalBtn');
  const enquiryForm = document.getElementById('enquiryForm');
  const clientServiceSelect = document.getElementById('clientService');
  const serviceEnquireBtns = document.querySelectorAll('.service-enquire-btn');

  function openModal(preselectedService = null) {
    if (!enquiryModal) return;
    if (preselectedService && clientServiceSelect) {
      // Look for a matching option
      for (let i = 0; i < clientServiceSelect.options.length; i++) {
        if (clientServiceSelect.options[i].text.toLowerCase().includes(preselectedService.toLowerCase()) ||
            clientServiceSelect.options[i].value.toLowerCase().includes(preselectedService.toLowerCase())) {
          clientServiceSelect.selectedIndex = i;
          break;
        }
      }
    }
    if (typeof enquiryModal.showModal === 'function') {
      enquiryModal.showModal();
    } else {
      enquiryModal.setAttribute('open', '');
    }
  }

  function closeModal() {
    if (!enquiryModal) return;
    if (typeof enquiryModal.close === 'function') {
      enquiryModal.close();
    } else {
      enquiryModal.removeAttribute('open');
    }
  }

  if (openEnquiryBtn) openEnquiryBtn.addEventListener('click', () => openModal());
  if (bottomEnquireBtn) bottomEnquireBtn.addEventListener('click', () => openModal());
  if (studioBookVisitBtn) studioBookVisitBtn.addEventListener('click', () => openModal('Wedding Invitation Cards'));
  if (closeEnquiryBtn) closeEnquiryBtn.addEventListener('click', closeModal);

  // Close when clicking modal backdrop
  if (enquiryModal) {
    enquiryModal.addEventListener('click', (e) => {
      const rect = enquiryModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeModal();
      }
    });
  }

  // Hook service card "Enquire" buttons to pre-select dropdown
  serviceEnquireBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      openModal(serviceName);
    });
  });

  // Handle Enquiry Form Submit -> WhatsApp Redirect
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName')?.value.trim() || 'Valued Customer';
      const phone = document.getElementById('clientPhone')?.value.trim() || '';
      const service = document.getElementById('clientService')?.value || 'Card Printing & Designing';
      const pressLoc = 'Tharekkad Card Printing Press (Near Ninan Complex, Palakkad)';
      const qty = document.getElementById('clientQuantity')?.value.trim();
      const date = document.getElementById('clientDate')?.value.trim();
      const notes = document.getElementById('clientNotes')?.value.trim();

      let enquiryText = 
        `Hello Zoom Cards Printing Press (Tharekkad, Palakkad),\n\n` +
        `I would like to place an enquiry for card printing / designing:\n` +
        `• Name: ${name}\n` +
        `• Phone: ${phone}\n` +
        `• Service: ${service}\n` +
        `• Press Location: ${pressLoc}\n` +
        `• Payment Mode Preferred: UPI / Cash\n`;

      if (qty) enquiryText += `• Estimated Quantity: ${qty}\n`;
      if (date) enquiryText += `• Event / Due Date: ${date}\n`;
      if (notes) enquiryText += `• Requirements / Notes: ${notes}\n`;

      enquiryText += `\nPlease provide sample photos and a quotation. Thank you!`;

      const waUrl = `https://wa.me/?text=${encodeURIComponent(enquiryText)}`;
      window.open(waUrl, '_blank');
      closeModal();
      enquiryForm.reset();
    });
  }

  /* ==========================================================================
     5. Mobile Navigation Menu Toggle
     ========================================================================== */

  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when clicking any nav link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     6. Header Scroll Shadow Effect
     ========================================================================== */

  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
      if (header) header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    } else {
      header?.classList.remove('scrolled');
      if (header) header.style.boxShadow = 'none';
    }
  }, { passive: true });

});
