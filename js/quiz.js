document.addEventListener('DOMContentLoaded', () => {
  const questionView = document.getElementById('quiz-question-view');
  const resultsView = document.getElementById('quiz-results-view');
  if (!questionView || !resultsView) return;

  const QUESTIONS = [
    { type: 'choice', text: 'Would your emergency contact know where to find your medical information?', gap: 'Medical information access' },
    { type: 'choice', text: 'Do they have a current list of your medications and allergies?', gap: 'Medication & allergy list' },
    { type: 'choice', text: "Would they know exactly who to call — doctor, insurance, family — without searching?", gap: 'Key contacts list' },
    { type: 'choice', text: 'Do they have access to your home, car, or safe if needed?', gap: 'Physical access planning' },
    { type: 'choice', text: 'Do they know your legal and financial contacts — attorney, accountant, or bank?', gap: 'Legal & financial contacts' },
    { type: 'choice', text: 'Would they know how to get into your phone or key accounts if needed?', gap: 'Digital & account access' },
    { type: 'choice', text: "If more than one person could step in, is it clear who's actually in charge?", gap: 'Clear decision-making authority' },
    {
      type: 'text',
      text: 'In your own words — where, specifically, would they find this information today?',
      placeholder: 'e.g. "a folder in my desk drawer" — or honestly, "nowhere yet"',
      gap: 'Written documentation',
    },
    { type: 'choice', text: "Would they know your wishes if you couldn't speak for yourself?", gap: 'Documented wishes & preferences' },
  ];

  const OPTIONS = [
    { label: 'Yes, definitely', points: 2 },
    { label: 'Somewhat / not sure', points: 1 },
    { label: 'No', points: 0 },
  ];

  const DISMISSIVE = /^(no|none|n\/?a|nowhere|idk|nothing|not sure|i don'?t know|dont know|no idea)\.?!?$/i;

  const MAX_SCORE = QUESTIONS.length * 2;

  const backBtn = document.getElementById('quiz-back');
  const stepLabel = document.getElementById('quiz-step-label');
  const percentLabel = document.getElementById('quiz-percent');
  const progressFill = document.getElementById('quiz-progress-fill');
  const questionText = document.getElementById('quiz-question-text');
  const optionsWrap = document.getElementById('quiz-options');

  const scoreNum = document.getElementById('score-num');
  const tierBadge = document.getElementById('tier-badge');
  const tierHeading = document.getElementById('tier-heading');
  const tierDesc = document.getElementById('tier-desc');
  const gapListWrap = document.getElementById('quiz-gap-list');
  const gapItems = document.getElementById('quiz-gap-items');
  const quizCta = document.getElementById('quiz-cta');
  const retakeBtn = document.getElementById('quiz-retake');

  let current = 0;
  let answers = [];

  function scoreTextAnswer(value) {
    const trimmed = value.trim();
    if (!trimmed || DISMISSIVE.test(trimmed)) return 0;
    return trimmed.length < 12 ? 1 : 2;
  }

  function renderQuestion() {
    resultsView.hidden = true;
    questionView.hidden = false;

    const q = QUESTIONS[current];
    backBtn.hidden = current === 0;
    stepLabel.textContent = `Question ${current + 1} of ${QUESTIONS.length}`;
    percentLabel.textContent = `${Math.round((current / QUESTIONS.length) * 100)}%`;
    progressFill.style.width = `${(current / QUESTIONS.length) * 100}%`;

    questionText.textContent = q.text;
    optionsWrap.innerHTML = '';

    if (q.type === 'text') {
      const wrap = document.createElement('div');
      wrap.className = 'quiz-text-wrap';

      const textarea = document.createElement('textarea');
      textarea.className = 'quiz-textarea';
      textarea.rows = 3;
      textarea.placeholder = q.placeholder || '';
      textarea.value = answers[current] ? answers[current].rawText || '' : '';
      wrap.appendChild(textarea);

      const continueBtn = document.createElement('button');
      continueBtn.type = 'button';
      continueBtn.className = 'btn btn-primary quiz-continue';
      continueBtn.textContent = 'Continue';
      continueBtn.disabled = !textarea.value.trim();
      wrap.appendChild(continueBtn);

      textarea.addEventListener('input', () => {
        continueBtn.disabled = !textarea.value.trim();
      });

      continueBtn.addEventListener('click', () => {
        const raw = textarea.value;
        const points = scoreTextAnswer(raw);
        advanceWith({ label: raw.trim() || '(left blank)', rawText: raw, points }, true);
      });

      optionsWrap.appendChild(wrap);
      return;
    }

    OPTIONS.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option';
      if (answers[current] && answers[current].label === opt.label) {
        btn.classList.add('selected');
      }
      btn.innerHTML = `<span class="opt-dot"></span><span>${opt.label}</span>`;
      btn.addEventListener('click', () => {
        answers[current] = opt;
        renderQuestion();
        advanceWith(opt, true);
      });
      optionsWrap.appendChild(btn);
    });
  }

  function advanceWith(answer, alreadyRendered) {
    answers[current] = answer;
    if (!alreadyRendered) renderQuestion();
    setTimeout(() => {
      if (current < QUESTIONS.length - 1) {
        current += 1;
        renderQuestion();
      } else {
        showResults();
      }
    }, 320);
  }

  function goBack() {
    if (current > 0) {
      current -= 1;
      renderQuestion();
    }
  }

  function showResults() {
    questionView.hidden = true;
    resultsView.hidden = false;

    const total = answers.reduce((sum, a) => sum + (a ? a.points : 0), 0);
    scoreNum.textContent = total;
    const scoreDen = document.getElementById('score-den');
    if (scoreDen) scoreDen.textContent = `out of ${MAX_SCORE}`;

    const gaps = QUESTIONS.filter((q, i) => !answers[i] || answers[i].points < 2).map((q) => q.gap);

    let tier;
    if (total >= Math.round(MAX_SCORE * 0.83)) {
      tier = {
        badge: 'Impressively Prepared',
        heading: "Your person is more ready than most.",
        desc: "You've clearly thought this through — that alone puts you ahead of most families. What paperwork can't do on its own is make it official. A notarized, printed Access Plan turns your preparation into something your family can act on immediately, with no guessing or interpretation required.",
        ctaLabel: 'Make It Official',
      };
    } else if (total >= Math.round(MAX_SCORE * 0.42)) {
      tier = {
        badge: 'Partially Prepared',
        heading: 'You have pieces in place — but real gaps remain.',
        desc: "Most families land here. A guided intake session closes the gaps above in under an hour, so your trusted contact isn't left guessing when it matters most.",
        ctaLabel: 'Close the Gaps',
      };
    } else {
      tier = {
        badge: 'Not Prepared Yet',
        heading: "Right now, your person would be left guessing.",
        desc: "That's more common than you'd think — and it's exactly what One More Thing was built to fix. One guided session changes this completely.",
        ctaLabel: 'Start My Plan',
      };
    }

    tierBadge.textContent = tier.badge;
    tierHeading.textContent = tier.heading;
    tierDesc.textContent = tier.desc;

    if (gaps.length) {
      gapListWrap.hidden = false;
      gapItems.innerHTML = gaps
        .map(
          (g) =>
            `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>${g}</li>`
        )
        .join('');
    } else {
      gapListWrap.hidden = true;
    }

    quizCta.textContent = tier.ctaLabel;
    const context = encodeURIComponent(`Quiz score ${total} of ${MAX_SCORE} (${tier.badge})`);
    quizCta.href = `book.html?context=${context}`;
  }

  backBtn.addEventListener('click', goBack);
  retakeBtn.addEventListener('click', () => {
    current = 0;
    answers = [];
    renderQuestion();
  });

  renderQuestion();
});
