document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('book-form');
  if (!form) return;

  const ageInput = document.getElementById('bf-age');
  const ageValue = document.getElementById('bf-age-value');
  if (ageInput && ageValue) {
    ageInput.addEventListener('input', () => {
      ageValue.textContent = ageInput.value;
    });
  }

  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get('service');
  const contextParam = params.get('context');

  if (serviceParam) {
    const map = {
      quality: 'Guided Intake Session ($100)',
      advanced: 'Full Access Plan ($175)',
      notary: 'Texas Notary Services (add-on)',
    };
    const targetValue = map[serviceParam] || serviceParam;
    form.querySelectorAll('input[name="service"]').forEach((cb) => {
      if (cb.value === targetValue) cb.checked = true;
    });
  }

  if (contextParam) {
    const messageField = document.getElementById('bf-message');
    if (messageField) messageField.value = `Context: ${contextParam}\n\n`;
  }

  /* ---------- Date / time picker (real calendar, simulated availability) ---------- */

  const TIME_SLOTS = ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM'];
  const calendarDaysWrap = document.getElementById('calendar-days');
  const calMonthLabel = document.getElementById('cal-month-label');
  const calPrevBtn = document.getElementById('cal-prev');
  const calNextBtn = document.getElementById('cal-next');
  const timeField = document.getElementById('time-field');
  const timeBubblesWrap = document.getElementById('time-bubbles');
  const timeDateLabel = document.getElementById('time-date-label');
  const bookError = document.getElementById('book-error');

  let selectedDateKey = null;
  let selectedDateLabel = null;
  let selectedTime = null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();

  function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }

  function availabilityFor(dateKey) {
    let h = hashString(dateKey);
    const count = 2 + (h % 4); // 2-5 of 6 slots open
    const indices = TIME_SLOTS.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      h = (h * 1103515245 + 12345) >>> 0;
      const j = h % (i + 1);
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const openSet = new Set(indices.slice(0, count));
    return TIME_SLOTS.map((slot, i) => ({ slot, available: openSet.has(i) }));
  }

  function dateKeyOf(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function renderCalendar() {
    calMonthLabel.textContent = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    calPrevBtn.disabled = viewYear === today.getFullYear() && viewMonth === today.getMonth();

    calendarDaysWrap.innerHTML = '';
    const firstDow = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (let i = 0; i < firstDow; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      calendarDaysWrap.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(viewYear, viewMonth, day);
      const dateKey = dateKeyOf(d);
      const isPast = d < today;
      const isToday = d.getTime() === today.getTime();

      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'calendar-day' + (isPast ? ' disabled' : '') + (isToday ? ' today' : '') + (dateKey === selectedDateKey ? ' selected' : '');
      cell.textContent = String(day);

      if (!isPast) {
        const dot = document.createElement('span');
        dot.className = 'avail-dot';
        cell.appendChild(dot);
        cell.addEventListener('click', () => selectDate(dateKey, d));
      } else {
        cell.disabled = true;
      }
      calendarDaysWrap.appendChild(cell);
    }
  }

  function selectDate(dateKey, dateObj) {
    selectedDateKey = dateKey;
    selectedDateLabel = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    selectedTime = null;
    renderCalendar();

    timeDateLabel.textContent = `for ${selectedDateLabel}`;
    timeBubblesWrap.innerHTML = '';
    availabilityFor(selectedDateKey).forEach(({ slot, available }) => {
      const tBtn = document.createElement('button');
      tBtn.type = 'button';
      tBtn.className = 'time-bubble' + (available ? '' : ' unavailable');
      tBtn.textContent = slot;
      if (available) {
        tBtn.addEventListener('click', () => {
          timeBubblesWrap.querySelectorAll('.time-bubble').forEach((b) => b.classList.remove('selected'));
          tBtn.classList.add('selected');
          selectedTime = slot;
          bookError.hidden = true;
        });
      } else {
        tBtn.disabled = true;
      }
      timeBubblesWrap.appendChild(tBtn);
    });
    timeField.hidden = false;
    bookError.hidden = true;
  }

  calPrevBtn.addEventListener('click', () => {
    viewMonth -= 1;
    if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
    renderCalendar();
  });
  calNextBtn.addEventListener('click', () => {
    viewMonth += 1;
    if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
    renderCalendar();
  });

  renderCalendar();

  /* ---------- Submit / success / reset ---------- */

  const formView = document.getElementById('book-form-view');
  const successView = document.getElementById('book-success-view');
  const successMessage = document.getElementById('book-success-message');
  const submitBtn = document.getElementById('book-submit-btn');
  const anotherBtn = document.getElementById('book-another-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (!selectedDateKey || !selectedTime) {
      bookError.hidden = false;
      calendarDaysWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const name = document.getElementById('bf-name').value.trim().split(' ')[0];
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Booking...';

    setTimeout(() => {
      successMessage.textContent = `You're set for ${selectedDateLabel} at ${selectedTime}${name ? `, ${name}` : ''}. A calendar invite and confirmation email are on their way, plus a reminder a day or two before your appointment — see you soon!`;
      formView.hidden = true;
      successView.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }, 1000);
  });

  if (anotherBtn) {
    anotherBtn.addEventListener('click', () => {
      form.reset();
      if (ageInput && ageValue) ageValue.textContent = ageInput.value;
      selectedDateKey = null;
      selectedDateLabel = null;
      selectedTime = null;
      timeField.hidden = true;
      timeBubblesWrap.innerHTML = '';
      bookError.hidden = true;
      viewYear = today.getFullYear();
      viewMonth = today.getMonth();
      renderCalendar();
      successView.hidden = true;
      formView.hidden = false;
    });
  }
});
