document.addEventListener('DOMContentLoaded', () => {
  const questionView = document.getElementById('quiz-question-view');
  const resultsView = document.getElementById('quiz-results-view');
  if (!questionView || !resultsView) return;

  // Each quiz page sets window.QUIZ_CONFIG (in a small <script> before this file)
  // with its own questions and result tiers — this file is the shared engine for
  // all three quizzes (Home / Emergency Contact / Pet), so the flow, scoring and
  // progress UI stay identical everywhere and only ever need fixing in one place.
  const CONFIG = window.QUIZ_CONFIG || { questions: [], tiers: {} };
  const QUESTIONS = CONFIG.questions;

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
    // count a real quiz completion (was never tracked before) — same beacon the
    // tracker snippet (t.js) sends for a data-track click, fired manually here
    // since finishing the quiz isn't a single click event
    try {
      if (window.__iw_track) window.__iw_track(CONFIG.trackEvent || 'quiz-complete');
    } catch {}

    const total = answers.reduce((sum, a) => sum + (a ? a.points : 0), 0);
    scoreNum.textContent = total;
    const scoreDen = document.getElementById('score-den');
    if (scoreDen) scoreDen.textContent = `out of ${MAX_SCORE}`;

    const gaps = QUESTIONS.filter((q, i) => !answers[i] || answers[i].points < 2).map((q) => q.gap);

    const tiers = CONFIG.tiers || {};
    let tier;
    if (total >= Math.round(MAX_SCORE * 0.83)) tier = tiers.high;
    else if (total >= Math.round(MAX_SCORE * 0.42)) tier = tiers.mid;
    else tier = tiers.low;

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
    const svc = CONFIG.ctaService ? `service=${encodeURIComponent(CONFIG.ctaService)}&` : '';
    quizCta.href = `book.html?${svc}context=${context}`;
  }

  backBtn.addEventListener('click', goBack);
  retakeBtn.addEventListener('click', () => {
    current = 0;
    answers = [];
    renderQuestion();
  });

  renderQuestion();
});
