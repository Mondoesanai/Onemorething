// Paste Angie's Google Business review link here once her profile exists,
// e.g. 'https://g.page/r/XXXXXXXXXXXX/review' — 4-5 star submissions will open it automatically.
const GOOGLE_REVIEW_URL = '';
// Where the rating/name/feedback actually get saved — same endpoint the tracker
// (t.js) posts to. Before this, the whole review widget was cosmetic: a click
// on Submit closed the form after a fake delay and nothing was ever recorded.
const REVIEW_ENDPOINT = 'https://agency-dashboard-omega-red.vercel.app/api/collect';

document.addEventListener('DOMContentLoaded', () => {
  const picker = document.getElementById('star-picker');
  if (!picker) return;

  const stars = Array.from(picker.querySelectorAll('.star-btn'));
  const submitBtn = document.getElementById('review-submit-btn');
  const nameField = document.getElementById('review-name');
  const textField = document.getElementById('review-text');
  const formView = document.getElementById('review-form-view');
  const thanksView = document.getElementById('review-thanks-view');
  const thanksHeading = document.getElementById('review-thanks-heading');
  const thanksMessage = document.getElementById('review-thanks-message');

  let selectedRating = 0;

  function paintStars(upTo, cls) {
    stars.forEach((s) => {
      s.classList.toggle(cls, Number(s.dataset.value) <= upTo);
    });
  }

  stars.forEach((star) => {
    star.addEventListener('mouseenter', () => paintStars(Number(star.dataset.value), 'hovered'));
    star.addEventListener('mouseleave', () => paintStars(0, 'hovered'));
    star.addEventListener('click', () => {
      selectedRating = Number(star.dataset.value);
      paintStars(selectedRating, 'selected');
      submitBtn.disabled = false;
    });
  });

  function sendReview() {
    try {
      const body = JSON.stringify({
        s: (location.hostname || '').replace(/^www\./, ''),
        u: location.href,
        e: 'ev',
        n: 'submit-review',
        rt: selectedRating,
        rn: (nameField && nameField.value || '').slice(0, 60),
        rx: (textField && textField.value || '').slice(0, 600),
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(REVIEW_ENDPOINT, new Blob([body], { type: 'application/json' }));
      } else {
        fetch(REVIEW_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
      }
    } catch (e) {
      /* never block the on-page thank-you over a network hiccup */
    }
  }

  submitBtn.addEventListener('click', () => {
    if (!selectedRating) return;
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    sendReview();

    setTimeout(() => {
      formView.hidden = true;
      thanksView.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;

      if (selectedRating >= 4) {
        thanksHeading.textContent = 'Thank you!';
        if (GOOGLE_REVIEW_URL) {
          thanksMessage.textContent = "We're pulling up Google for you now...";
          window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener');
        } else {
          thanksMessage.textContent = "We're so glad to hear it — your review helps other families find One More Thing.";
        }
      } else {
        thanksHeading.textContent = 'Thanks for the honest feedback.';
        thanksMessage.innerHTML = 'We\'d love the chance to make it right — <a href="mailto:AngieMay@omtservices.com?subject=Feedback%20from%20your%20site" style="color:var(--tan-400);text-decoration:underline;">email Angie directly</a>.';
      }
    }, 500);
  });
});
