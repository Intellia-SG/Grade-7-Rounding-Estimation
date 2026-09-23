// ──────────────────────────────────────────────────
// Narration Scripts — Rounding & Estimation
// Strict 1:1 Parity with on-screen text (Paragraphs & Questions ONLY)
// ──────────────────────────────────────────────────

import { say, ask, cheer, think, celebrate, instruct } from './audio';

// Intro Screen Narration
export function introNarration() {
  return [
    cheer("Welcome to the Global Estimation Squad!"),
    say("Today, we are going to master rounding and estimation across world landmarks."),
    ask("How can rounding help us find quick, reasonable answers without counting every single thing?"),
    cheer("Are you ready to join the squad and explore estimation challenges? Let us get started!")
  ];
}

// Wonder Phase Narration
export function wonderNarration(questionText, subtext) {
  return [
    think(questionText),
    say(subtext)
  ];
}

export function wonderDiscoverNarration() {
  return [
    celebrate("Let us discover how rounding and estimation give us real-world superpowers!")
  ];
}

// Story Phase Narrations (6 Panels)
export function getStoryNarration(panelIndex) {
  switch (panelIndex) {
    case 0:
      return [
        say("John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, and Yuki form the Global Estimation Squad. They love using smart estimates in everyday life!")
      ];
    case 1:
      return [
        say("Mike is shopping in New York. His cart shows eighteen dollars and seventy-five cents, six dollars and forty cents, and eleven dollars and twenty cents. About how much will he pay altogether?")
      ];
    case 2:
      return [
        say("Rounding each price to the nearest dollar makes eighteen seventy-five about nineteen dollars, six forty about six dollars, and eleven twenty about eleven dollars. Nineteen plus six plus eleven is about thirty-six dollars!")
      ];
    case 3:
      return [
        say("Priya in Mumbai reads that a passenger train has three thousand nine hundred twelve seats. She rounds it to the nearest thousand: about four thousand seats!")
      ];
    case 4:
      return [
        say("Diego checks his math homework: three hundred ninety-six times twenty-one. Using compatible numbers, four hundred times twenty equals eight thousand! His exact answer should be close to that.")
      ];
    case 5:
      return [
        say("Every city, every receipt, every big calculation: rounding and estimation help us think fast, budget wisely, and check our work!")
      ];
    default:
      return [say("Rounding and estimation help us every day!")];
  }
}

// Simulate Phase Station Narrations
export function simulateStation1Intro() {
  return [
    instruct("Slide the number along the number line. Which benchmark tick is it closest to? Watch the marker snap into place!")
  ];
}

export function simulateStation2Intro() {
  return [
    instruct("Look at the four estimation cards. Tap the cards that show a reasonable estimate for the pictured quantity!")
  ];
}

export function simulateStation3Intro() {
  return [
    instruct("Fill in the missing blank in the estimation equation using the number pad!")
  ];
}

// Play Phase Narrations
export function playWorldIntro(worldName) {
  return [
    cheer(`Welcome to ${worldName}! Ready to solve 10 estimation challenges?`)
  ];
}

export function playReadQuestion(questionText) {
  return [
    ask(questionText)
  ];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) {
    return [
      celebrate(`Incredible! You are on a ${streak} question streak! Perfect estimate!`)
    ];
  }
  return [
    cheer("Great job! That estimate is right on target!")
  ];
}

export function playWrongNarration() {
  return [
    think("Not quite. Let us check the benchmark numbers and try again!")
  ];
}

export function playWorldComplete(worldName, score, total) {
  return [
    celebrate(`Congratulations! You completed ${worldName} with ${score} out of ${total} points!`)
  ];
}

// Reflect Phase Narrations
export function reflectIntroNarration() {
  return [
    think("Let us reflect on what we learned! Can you help teach Rounder the core ideas of rounding and estimation?")
  ];
}

export function reflectCorrectNarration() {
  return [
    celebrate("Spot on! That explains rounding and estimation clearly!")
  ];
}

export function reflectWrongNarration() {
  return [
    think("Think about how benchmark numbers help us approximate reasonable values.")
  ];
}

export function reflectConfidenceNarration() {
  return [
    ask("How confident do you feel about rounding and estimation? Every answer is great!")
  ];
}

export function reflectCertificateNarration(pct) {
  return [
    celebrate(`Congratulations on completing the journey with ${pct} percent! You are an Estimation Squad hero!`)
  ];
}
