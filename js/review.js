// TODO: paste Angie's Google Business review link here once her profile exists,
// e.g. 'https://g.page/r/XXXXXXXXXXXX/review' — 4-5 star submissions will open it automatically.
const GOOGLE_REVIEW_URL = '';

document.addEventListener('DOMContentLoaded', () => {
  const picker = document.getElementById('star-picker');
  if (!picker) return;

  const stars = Array.from(picker.querySelectorAll('.star-btn'));
  const submitBtn = document.getElementById('review-submit-btn');
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

  submitBtn.addEventListener('click', () => {
    if (!selectedRating) return;
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

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
    }, 700);
  });
});
