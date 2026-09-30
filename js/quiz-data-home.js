window.QUIZ_CONFIG = {
  trackEvent: 'quiz-complete-home',
  ctaService: 'in-home-family-plan',
  questions: [
    { text: 'Would your household know exactly where to go during a tornado or shelter-in-place emergency?', gap: 'Tornado & shelter-in-place readiness' },
    { text: 'Do you have a clear meeting location outside the home if you get separated?', gap: 'Meeting locations' },
    { text: 'Would everyone know how to access medications, medical supplies, or mobility devices quickly?', gap: 'Medication access' },
    { text: 'Is there a designated person responsible for communicating updates to family members outside the area?', gap: 'Communication roles' },
    { text: 'Do you have a reliable power backup plan (flashlights, batteries, chargers, etc.)?', gap: 'Power supply' },
    { text: 'Would seniors, children, or individuals with special needs know what to do without confusion?', gap: 'Senior & child needs' },
    { text: 'Is your emergency information (contacts, instructions, documents) stored in a place everyone can find?', gap: 'Shared emergency information' },
    { text: 'Do you have essential items ready — shoes, chargers, medication kits, pet supplies, etc.?', gap: 'Emergency items checklist' },
    { text: 'Has your family practiced or reviewed your emergency plan within the last year?', gap: 'Practice & review' },
  ],
  tiers: {
    high: {
      badge: 'Impressively Prepared',
      heading: 'Your household is more ready than most.',
      desc: "You've already covered the basics most families miss. The next step is turning that readiness into a written plan the whole household — seniors, kids and pets included — can follow without you there to walk them through it.",
      ctaLabel: 'Build the Full Plan',
    },
    mid: {
      badge: 'Partially Prepared',
      heading: 'You have pieces in place — but real gaps remain.',
      desc: 'Most households land here. An In-Home Family Emergency Plan closes the gaps above in a guided group workshop, so every person in the home — not just you — knows what to do.',
      ctaLabel: 'Close the Gaps',
    },
    low: {
      badge: 'Not Prepared Yet',
      heading: 'Right now, your household would be figuring it out in the moment.',
      desc: "That's more common than you'd think — and it's exactly what One More Thing's group workshops were built to fix. One session, done together as a family, changes this completely.",
      ctaLabel: 'Start My Plan',
    },
  },
};
