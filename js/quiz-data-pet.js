window.QUIZ_CONFIG = {
  trackEvent: 'quiz-complete-pet',
  ctaService: 'pet-packet',
  questions: [
    { text: "Would someone know your pet's daily routine — feeding, medication, and care instructions?", gap: 'Daily routine' },
    { text: "Is your pet's medication list and dosage information written down somewhere accessible?", gap: 'Feeding & medication details' },
    { text: "Would a caregiver know your vet's name, clinic, and emergency contact number?", gap: 'Vet information' },
    { text: 'Does someone have access to your home to retrieve your pet if needed?', gap: 'Access to home' },
    { text: "Is your pet's ID tag or microchip information up to date?", gap: 'Pet ID & microchip' },
    { text: 'Do you have a designated emergency caregiver who could step in immediately?', gap: 'Emergency caregiver' },
    { text: 'Are your pet’s supplies (food, leash, carrier, medication, comfort items) easy to find?', gap: 'Supplies' },
    { text: 'Would someone know how to evacuate with your pet safely and quickly?', gap: 'Evacuation readiness' },
    { text: "Have you reviewed or updated your pet's emergency plan within the last year?", gap: 'Practice & review' },
  ],
  tiers: {
    high: {
      badge: 'Impressively Prepared',
      heading: "Your pet's plan is more ready than most.",
      desc: "You've already covered what most pet owners miss. The last step is putting it on paper — a Pet Preparedness Packet means a caregiver who has never met your pet could still step in and get it right.",
      ctaLabel: 'Make It Official',
    },
    mid: {
      badge: 'Partially Prepared',
      heading: 'You have pieces in place — but real gaps remain.',
      desc: 'Most pet owners land here. A Pet Preparedness Packet closes the gaps above, so whoever steps in — a neighbor, a family member, a sitter — has exactly what they need.',
      ctaLabel: 'Close the Gaps',
    },
    low: {
      badge: 'Not Prepared Yet',
      heading: 'Right now, a caregiver would be left guessing.',
      desc: "That's more common than you'd think — and it's exactly what the Pet Preparedness Packet was built to fix. One simple packet changes this completely.",
      ctaLabel: 'Start My Plan',
    },
  },
};
