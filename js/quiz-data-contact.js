window.QUIZ_CONFIG = {
  trackEvent: 'quiz-complete-contact',
  ctaService: '',
  questions: [
    { text: 'Would your emergency contact know where to find your medical information right now?', gap: 'Medical information access' },
    { text: 'Do they have a current list of your medications, allergies, and conditions?', gap: 'Medication & allergy list' },
    { text: 'Would they know exactly who to call — doctor, insurance, family — without searching?', gap: 'Key contacts list' },
    { text: 'Do they have access to your home, car, or safe if needed?', gap: 'Physical access planning' },
    { text: 'Do they know your legal and financial contacts — attorney, accountant, or bank?', gap: 'Legal & financial contacts' },
    { text: 'Would they know how to get into your phone or key accounts if needed?', gap: 'Digital & account access' },
    { text: "If more than one person could step in, is it clear who is actually in charge?", gap: 'Clear decision-making authority' },
    { text: 'Do they know exactly where your important information is stored (folder, binder, drawer, digital location)?', gap: 'Written documentation' },
    { text: "Would they know your wishes if you couldn't speak for yourself?", gap: 'Documented wishes & preferences' },
  ],
  tiers: {
    high: {
      badge: 'Impressively Prepared',
      heading: 'Your person is more ready than most.',
      desc: "You've clearly thought this through — that alone puts you ahead of most families. What paperwork can't do on its own is make it official. A notarized, printed Access Plan turns your preparation into something your family can act on immediately, with no guessing or interpretation required.",
      ctaLabel: 'Make It Official',
    },
    mid: {
      badge: 'Partially Prepared',
      heading: 'You have pieces in place — but real gaps remain.',
      desc: "Most families land here. A guided intake session closes the gaps above in under an hour, so your trusted contact isn't left guessing when it matters most.",
      ctaLabel: 'Close the Gaps',
    },
    low: {
      badge: 'Not Prepared Yet',
      heading: 'Right now, your person would be left guessing.',
      desc: "That's more common than you'd think — and it's exactly what One More Thing was built to fix. One guided session changes this completely.",
      ctaLabel: 'Start My Plan',
    },
  },
};
