document.addEventListener('DOMContentLoaded', () => {

  // 1. Mini Countdown Timer (Format: 05h : 24m : 18s)
  let duration = (5 * 3600) + (24 * 60) + 18;
  const timerMini = document.getElementById('timerMini');

  setInterval(() => {
    duration--;
    if (duration <= 0) duration = 5 * 3600;

    const hrs = String(Math.floor(duration / 3600)).padStart(2, '0');
    const mins = String(Math.floor((duration % 3600) / 60)).padStart(2, '0');
    const secs = String(duration % 60).padStart(2, '0');

    if (timerMini) {
      timerMini.textContent = `${hrs}h : ${mins}m : ${secs}s`;
    }
  }, 1000);

  // 2. Mobile Navbar Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      if (navLinks.classList.contains('open')) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(255, 253, 250, 0.98)';
        navLinks.style.padding = '1.5rem';
        navLinks.style.borderBottom = '1px solid rgba(245, 158, 11, 0.2)';
      } else {
        navLinks.style.display = '';
      }
    });
  }

  // 3. Interactive Main View Image & Thumbnails Switcher (Hero Section)
  const mainView = document.getElementById('main-view');
  const colorLabel = document.getElementById('color-label');
  const thumbBtns = document.querySelectorAll('.thumb-btn');
  const variantRadios = document.querySelectorAll('input[name="selected_variant"]');

  thumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      thumbBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const imgUrl = btn.getAttribute('data-img');
      const prodName = btn.getAttribute('data-name');

      if (mainView) {
        mainView.style.opacity = '0.3';
        setTimeout(() => {
          mainView.src = imgUrl;
          if (colorLabel) colorLabel.textContent = prodName;
          mainView.style.opacity = '1';
        }, 150);
      }

      // Sync selection with package radio cards
      const keyword = prodName.split(' ')[0]; // e.g. "রোজ", "২৪কে", "৩-ইন-১"
      variantRadios.forEach(radio => {
        if (radio.value.startsWith(keyword) || prodName.includes(radio.value)) {
          radio.checked = true;
          updatePackagePillStyles();
        }
      });

      calculateOrderTotal();
    });
  });

  // Package Pills Selection Handler
  const packagePills = document.querySelectorAll('.package-card-pill');
  packagePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const radio = pill.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        updatePackagePillStyles();

        // Sync main view hero gallery with selected package
        const radioKey = radio.value.split(' ')[0];
        thumbBtns.forEach(b => {
          const btnName = b.getAttribute('data-name');
          if (btnName && (btnName.startsWith(radioKey) || radio.value.includes(btnName.split(' ')[0]))) {
            thumbBtns.forEach(t => t.classList.remove('active'));
            b.classList.add('active');
            if (mainView) mainView.src = b.getAttribute('data-img');
            if (colorLabel) colorLabel.textContent = btnName;
          }
        });
      }

      calculateOrderTotal();
    });
  });

  const selectedPkgNameEl = document.getElementById('selected-pkg-name');
  const selectedPkgPriceEl = document.getElementById('selected-pkg-price');

  function updatePackagePillStyles() {
    variantRadios.forEach(r => {
      const parent = r.closest('.package-card-pill');
      if (parent) {
        const isChecked = r.checked;
        parent.classList.toggle('active', isChecked);
        if (isChecked) {
          if (selectedPkgNameEl) selectedPkgNameEl.textContent = r.value;
          if (selectedPkgPriceEl) selectedPkgPriceEl.textContent = r.getAttribute('data-price');
        }
      }
    });
  }

  // Global helper for product showcase card CTA buttons
  window.selectVariant = function(variantName, price) {
    const keyword = variantName.split(' ')[0];
    variantRadios.forEach(r => {
      if (r.value.includes(keyword) || variantName.includes(r.value.split(' ')[0])) {
        r.checked = true;
        updatePackagePillStyles();
      }
    });

    thumbBtns.forEach(b => {
      const btnName = b.getAttribute('data-name');
      if (btnName && (btnName.includes(keyword) || variantName.includes(btnName.split(' ')[0]))) {
        thumbBtns.forEach(t => t.classList.remove('active'));
        b.classList.add('active');
        if (mainView) mainView.src = b.getAttribute('data-img');
        if (colorLabel) colorLabel.textContent = btnName;
      }
    });

    calculateOrderTotal();
  };

  // 4. Quantity Controls & Delivery Calculation
  const qtyInput = document.getElementById('qty-input');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyMinus = document.getElementById('qty-minus');

  if (qtyPlus && qtyInput) {
    qtyPlus.addEventListener('click', () => {
      let current = parseInt(qtyInput.value) || 1;
      if (current < 10) {
        qtyInput.value = current + 1;
        calculateOrderTotal();
      }
    });
  }

  if (qtyMinus && qtyInput) {
    qtyMinus.addEventListener('click', () => {
      let current = parseInt(qtyInput.value) || 1;
      if (current > 1) {
        qtyInput.value = current - 1;
        calculateOrderTotal();
      }
    });
  }

  const deliveryRadios = document.querySelectorAll('input[name="delivery_area"]');
  deliveryRadios.forEach(r => {
    r.addEventListener('change', () => {
      deliveryRadios.forEach(d => {
        const p = d.closest('.delivery-card-clean');
        if (p) p.classList.toggle('active', d.checked);
      });
      calculateOrderTotal();
    });
  });

  // Dynamic Price Summary Calculator
  const summaryQty = document.getElementById('summary-qty');
  const summaryProdPrice = document.getElementById('summary-prod-price');
  const summaryDelPrice = document.getElementById('summary-del-price');
  const summaryTotalPrice = document.getElementById('summary-total-price');
  const btnTotal = document.getElementById('btn-total');

  function calculateOrderTotal() {
    const qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
    
    let unitPrice = 1850;
    const selectedVariantInput = document.querySelector('input[name="selected_variant"]:checked');
    if (selectedVariantInput) {
      unitPrice = parseInt(selectedVariantInput.getAttribute('data-price')) || 1850;
    }

    let delCharge = 70;
    const selectedDelivery = document.querySelector('input[name="delivery_area"]:checked');
    if (selectedDelivery) {
      delCharge = parseInt(selectedDelivery.value) || 70;
    }

    const prodSubtotal = qty * unitPrice;
    const grandTotal = prodSubtotal + delCharge;

    if (summaryQty) summaryQty.textContent = qty;
    if (summaryProdPrice) summaryProdPrice.textContent = prodSubtotal;
    if (summaryDelPrice) summaryDelPrice.textContent = delCharge;
    if (summaryTotalPrice) summaryTotalPrice.textContent = grandTotal;
    if (btnTotal) btnTotal.textContent = grandTotal;
  }

  calculateOrderTotal();

  // 5. Checkout Form Submit & Modal
  const checkoutForm = document.getElementById('checkout-form');
  const modal = document.getElementById('order-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalWaBtn = document.getElementById('modal-wa-btn');

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('cust-name').value.trim();
      const phone = document.getElementById('cust-phone').value.trim();
      const address = document.getElementById('cust-address').value.trim();

      const selectedVariant = document.querySelector('input[name="selected_variant"]:checked')?.value || '২৪কে গোল্ড সাফ্রন সেরাম';
      const qty = qtyInput ? qtyInput.value : 1;
      const totalAmount = summaryTotalPrice ? summaryTotalPrice.textContent : '১৯২০';

      const orderId = '#AP-' + Math.floor(1000 + Math.random() * 9000);

      document.getElementById('m-id').textContent = orderId;
      document.getElementById('m-name').textContent = name;
      document.getElementById('m-phone').textContent = phone;
      document.getElementById('m-variant').textContent = `${selectedVariant} (${qty}টি)`;
      document.getElementById('m-total').textContent = `৳${totalAmount}`;

      const waText = encodeURIComponent(`হ্যালো Aurélia Paris, আমি নতুন অর্ডার করেছি!\n\nঅর্ডার আইডি: ${orderId}\nনাম: ${name}\nফোন: ${phone}\nঠিকানা: ${address}\nপ্যাকেজ: ${selectedVariant} (${qty}টি)\nসর্বমোট প্রদেয়: ৳${totalAmount}`);
      if (modalWaBtn) {
        modalWaBtn.href = `https://wa.me/8801602867954?text=${waText}`;
      }

      if (modal) modal.classList.add('open');
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (modal) modal.classList.remove('open');
      if (checkoutForm) checkoutForm.reset();
      calculateOrderTotal();
    });
  }

  // 6. Single Line Reviews Horizontal Slider (Prev / Next & Dots)
  const reviewsSlider = document.getElementById('reviews-slider');
  const prevBtn = document.getElementById('rev-prev');
  const nextBtn = document.getElementById('rev-next');
  const dotsContainer = document.getElementById('rev-dots');

  if (reviewsSlider && prevBtn && nextBtn && dotsContainer) {
    const cards = reviewsSlider.querySelectorAll('.review-card');
    dotsContainer.innerHTML = '';

    cards.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        const cardWidth = cards[0].offsetWidth + 24;
        reviewsSlider.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
    });

    const updateDots = () => {
      const cardWidth = cards[0].offsetWidth + 24;
      const scrollPos = reviewsSlider.scrollLeft;
      const activeIdx = Math.round(scrollPos / cardWidth);
      
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === activeIdx);
      });
    };

    reviewsSlider.addEventListener('scroll', updateDots);

    prevBtn.addEventListener('click', () => {
      const cardWidth = cards[0].offsetWidth + 24;
      reviewsSlider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      const cardWidth = cards[0].offsetWidth + 24;
      reviewsSlider.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
  }

});
