# Product Requirements Document (PRD)
## Rounding & Estimation — Number Sense & Reasonable Answers | Grade 7 Math
### Intellia SG | Global Grade 7 Mathematics Curriculum

---

## 1. Executive Summary

This document defines the product requirements for **"Global Estimation Squad — Rounding & Estimation"**, an interactive, gamified, simulation-based lesson module for **Grade 7 students (age 12–13)**, teaching **Rounding & Estimation** (rounding whole numbers and decimals, estimating sums/differences/products/quotients, front-end estimation, compatible numbers, and checking whether an exact answer is reasonable).

The module is built as a standalone **React (Vite + JSX)** web application and is designed to **strictly mirror the visual language, UX structure, interaction patterns, and component architecture** of the reference product:

- Reference site (strict UI match): **https://grade5-time-intervals.vercel.app/**
- Reference repository (strict structure match): **https://github.com/p1pachare-cloud/Grade5-Time-Intervals**

The module will be hosted within the Intellia course catalogue (the same family of URLs as `https://intelliasg.com/courses/grade-3-math`, restructured for Grade 7), e.g.:

```
https://intelliasg.com/courses/grade-7-math/lessons/rounding-and-estimation/
```

Audio narration follows the **ElevenLabs pipeline** documented in `audio_generation_pipeline.md` (Voice: **Alice**, Voice ID: `Xb7hH8MSUJpSbSDYk0k2`, Model: `eleven_multilingual_v2`), using the same hybrid pre-generation + dynamic fallback architecture, the same per-style voice settings table, and the same strict rule that **only paragraph text and questions are narrated — never titles or headings**.

The lesson follows a global, multicultural narrative featuring students from around the world (John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, Yuki, Priya, Fatima, Diego, Chloe, Ravi) who form the **Global Estimation Squad**, using rounding and estimation to solve real-world problems — budgeting for trips, checking receipts, estimating crowd sizes, and comparing measurements from different countries — proving that a smart estimate is often the fastest and most useful answer.

The module follows Intellia's proven **6-phase learner journey**: INTRO → WONDER → STORY → SIMULATE → PLAY → REFLECT.

---

## 2. Product Vision & Goals

**Vision**
To make rounding and estimation feel like a real-world superpower — helping 12–13 year old learners confidently round numbers, estimate calculations, and judge whether an answer "makes sense," through a fully simulation-first, story-driven, and randomized gamified experience.

**Goals**

| Goal                        | Metric                                                      |
| ---------------------------- | ------------------------------------------------------------ |
| Learning Completion          | ≥85% of students complete all 6 phases                       |
| Practice Engagement          | ≥90% attempt at least 10 practice questions                  |
| Score Achievement            | Average challenge score ≥75% on first attempt                |
| Session Duration             | Average engagement ≥18 minutes per session                   |
| Curriculum Alignment         | 100% aligned to global Grade 7 number sense standards        |
| Phase Progression            | ≥80% reach Play phase in a single session                    |
| Simulation Interaction Rate  | ≥95% attempt all 3 simulation stations                       |
| Randomization Integrity      | 0% repeated question order across sessions                   |

---

## 3. Target Users

**Primary: Grade 7 Students (Age 12–13)**

- Confident readers, ready for multi-step reasoning and abstract number relationships
- Learn best through simulation-first exploration (number lines, visual benchmarks) before formal practice
- Motivated by streaks, badges, a world progress map, and a strong story arc
- International/global classroom context — familiar with shopping, sports statistics, travel budgets, and comparing prices/measurements across countries

**Secondary: Parents & Teachers**

- Assign as classwork, homework, or enrichment
- Expect alignment to recognized global standards (see Section 4)
- Monitor completion via in-lesson phase indicators

---

## 4. Curriculum Alignment — Global Grade 7 Mathematics

**Topic:** Rounding & Estimation
**Programme:** Intellia Grade 7 Math — Number Sense & Operations: Estimation
**Lesson URL:** `https://intelliasg.com/courses/grade-7-math/lessons/rounding-and-estimation/`

**Source References (cross-referenced against major global frameworks):**

- U.S. Common Core Math Standards — Grade 7 Number System / Grade 4–6 rounding foundations extended to rational numbers and multi-step estimation (7.NS.A, 7.EE.B.3 — "solve multi-step problems... assess reasonableness of answers using mental computation and estimation strategies")
- Singapore MOE Secondary 1 Mathematics Syllabus — Approximation and Estimation (rounding to a given number of decimal places / significant figures, estimating results of computation)
- UK National Curriculum — Key Stage 3, Year 7 Number (round numbers and measures to an appropriate degree of accuracy; use approximation through rounding to estimate answers and calculate possible resulting errors)
- CBSE/NCERT Class 7 Mathematics — "Fractions and Decimals" / "Rational Numbers" rounding-off and estimation of sums, differences, products and quotients before computing
- Australian Curriculum — Year 7 Number and Algebra (round decimals to a specified number of decimal places; use estimation to check the reasonableness of answers)

**Learning Objectives Covered:**

| LO   | Description                                                                                   |
| ---- | ----------------------------------------------------------------------------------------------- |
| LO1  | Round whole numbers to the nearest 10, 100, 1,000, and 10,000                                    |
| LO2  | Round decimals to the nearest whole number, tenth, and hundredth                                 |
| LO3  | Use front-end estimation to quickly estimate a sum or difference                                 |
| LO4  | Estimate sums and differences of whole numbers and decimals by rounding                          |
| LO5  | Estimate products and quotients using rounding and compatible numbers                            |
| LO6  | Choose compatible numbers to simplify a division or multiplication estimate                      |
| LO7  | Solve real-world word problems using estimation (shopping, travel, budgeting, measurement)       |
| LO8  | Judge whether a given exact answer is reasonable by comparing it to an estimate                  |
| LO9  | Identify the most efficient estimation strategy for a given problem (rounding vs. front-end vs. compatible numbers) |
| LO10 | Reason about how much an estimate may be an overestimate or underestimate, and why                |

**Concrete → Pictorial → Abstract (CPA) Progression:**

- **Concrete:** Interactive number line with a sliding marker that snaps to the nearest benchmark (ten, hundred, tenth, etc.)
- **Pictorial:** Paired "estimate vs. exact" visual cards (jars of coins, crowd photos, price tags, distance bars) that show a quantity and its rounded benchmark
- **Abstract:** Estimation equations — `Rounded Value ① ± / × / ÷ Rounded Value ② ≈ Estimate`

**Number Ranges:**

- Easy: Rounding whole numbers to the nearest 10/100; estimating sums/differences of 2–3 digit numbers
- Medium: Rounding decimals to the nearest tenth/hundredth; estimating products/quotients with 2–4 digit numbers and simple decimals
- Hard: Multi-step word problems; compatible-number division with larger numbers; judging reasonableness of a given exact computation; identifying over/under-estimate direction

**Vocabulary Focus:** "round", "nearest", "estimate", "approximate", "front-end estimation", "compatible numbers", "reasonable", "overestimate", "underestimate", "benchmark number", "significant figure", "about", "roughly"

---

## 5. The 6-Phase Learner Journey (Intellia Model)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ INTRO SCREEN → Progress Map (6-step visual tracker, top bar)               │
│ Welcome: "Hello, Explorer! Ready to master Rounding & Estimation? 🌍🔢"    │
│ Lesson badge shown (locked). 6 glowing phase dots visible.                 │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1 — WONDER (≈1–2 min)                                                │
│                                                                             │
│ Hook: "42,187 people are at a stadium in Rio de Janeiro. Sarah needs to    │
│ tell her friend 'about how many people' were there — without counting     │
│ every single one. What should she say?"                                   │
│                                                                             │
│ Visual: Animated stadium filling with tiny dots, a rounding dial spinning │
│ Narration (ElevenLabs): Alice voice reads the hook warmly                 │
│ → Mascot "Rounder" (a friendly rounding-dial robot) appears, curious      │
│ → "Let's discover how ROUNDING & ESTIMATION help us solve this fast!"    │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2 — STORY (≈2–3 min) — "The Global Estimation Squad"                │
│                                                                             │
│ Panel 1: John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, and    │
│          Yuki form the Global Estimation Squad — friends from different   │
│          countries who challenge each other to estimate real quantities   │
│          before checking the exact answer.                                │
│ Panel 2: "Mike is shopping in New York. His cart shows $18.75, $6.40, and │
│          $11.20. About how much will he pay altogether?"                 │
│ Panel 3: Number-line diagram animates each price rounding to the nearest  │
│          dollar — $19 + $6 + $11 ≈ $36.                                   │
│ Panel 4: "Priya in Mumbai reads that a train has 3,912 seats. She rounds  │
│          it to the nearest thousand — about 4,000 seats!"                 │
│ Panel 5: "Diego checks his math homework: 396 × 21. He estimates using    │
│          compatible numbers — 400 × 20 = 8,000 — 'my exact answer should  │
│          be close to that!'"                                              │
│ Panel 6: "Every city, every receipt, every big number — rounding and      │
│          estimation help us think fast and check our work!"               │
│                                                                             │
│ → Illustrated story panels (animated slide-in), ElevenLabs narration      │
│ → Key vocabulary highlighted: "round", "estimate", "compatible numbers"   │
│ → World map background with pins on each character's city                │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3 — SIMULATE (≈5–7 min)                                              │
│                                                                             │
│ 3 Interactive Stations — student must complete all 3 to advance           │
│                                                                             │
│ Station A — "Number Line Rounding Slide" (Concrete)                       │
│ Drag a number marker onto a zoomable number line; the marker snaps to the │
│ nearest benchmark (ten/hundred/tenth/hundredth) as it animates into place.│
│                                                                             │
│ Station B — "Estimate or Exact?" (Pictorial)                              │
│ 4 paired "quantity + printed estimate" cards (coin jars, crowd photos,    │
│ price tags). Student taps the card(s) where the printed estimate is a     │
│ reasonable rounding of the pictured quantity.                             │
│                                                                             │
│ Station C — "Build the Estimate Equation" (Abstract)                      │
│ "Round① ___ (op) Round② ___ ≈ ___" — fill one blank using a number-pad,   │
│ with a benchmark number line shown as a scaffold.                        │
│                                                                             │
│ → Mascot Rounder reacts to each completed station                        │
│ → ElevenLabs narrates each station instruction and feedback              │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 4 — PLAY (≈7–9 min)                                                  │
│                                                                             │
│ IntelliPlay™ Level: 100 randomized questions across 10 worlds             │
│ (each world = a real-world global landmark)                              │
│ 10 questions per world, world unlocks at ≥6/10 correct                   │
│ Stars (1–3), XP, badges, and streak fire counter active                  │
│ → Mastery gates the world map; encouragement-first feedback              │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 5 — REFLECT (≈1–2 min)                                               │
│                                                                             │
│ Journal prompt: "Think of something you estimated this week — a price,    │
│ a crowd, a distance. How close was your estimate? Tell Rounder!"          │
│ Or: LearnFlow AI chat — type/speak your understanding                    │
│ Lesson complete badge unlocks here. Summary of XP + badges shown.        │
│ → "Share with your teacher!" button (screenshot / export)                │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Phase 3 — Simulation Design (Detailed)

### 6.1 Station A — "Number Line Rounding Slide" (Concrete)

**Visual:**

- A large, horizontally scrollable/zoomable number line with labeled benchmark ticks (e.g., 40 / 50 / 60, or 3.1 / 3.2 / 3.3)
- A glowing draggable marker starts at the target number's exact position
- "Slide the number to the nearest benchmark! Which tick is it closer to?" narrated by Alice

**Interaction:**

- Student drags the marker along the number line (or taps the correct benchmark tick for accessibility mode)
- The marker **snaps and animates** to the nearest tick when released
- A "distance" indicator briefly shows how far the number is from each neighboring benchmark
- Submit button appears once the marker has been placed on a tick

**Feedback:**

- Correct snap → mascot Rounder spins happily, "Perfect! You rounded it exactly right!" 🎉
- Incorrect snap on submit → gentle shake + "Not quite — check which benchmark is closer!"

**Variants per round (randomized):**

- Round 1: Round 428 to the nearest ten (no midpoint ambiguity)
- Round 2: Round 3,652 to the nearest hundred (crosses a "5" midpoint rule)
- Round 3: Round 7.86 to the nearest tenth (decimal number line)
- Round 4: Round 19,500 to the nearest thousand (classic "round up" rule at exactly the midpoint)

### 6.2 Station B — "Estimate or Exact?" (Pictorial)

**Visual:**

- 4 cards displayed in a 2×2 grid; each card shows a **pictured quantity** (a jar of coins, a stadium crowd, a receipt, a distance bar) and a printed **estimate label** (e.g., "About 500 coins")
- Some cards show a reasonable estimate; some are deliberately unreasonable

**Interaction:**

- Student taps the card(s) where the printed estimate is a reasonable rounding of the pictured quantity
- Multi-select allowed; correct cards glow green, incorrect glow red on submit

**Teaching goal:**

- Reinforces the idea that an estimate should be "close" and use an appropriate benchmark — not wildly off, and not falsely exact

**Distractor design:**

- Mismatched cards are off by an implausible amount (rounded to the wrong place value, or rounded in the wrong direction)
- One card always shows a suspiciously "too exact" number labeled as an estimate (catches skimmers who think any number can be an estimate)

**3 rounds with increasing complexity:**

- Round 1: Whole-number rounding to the nearest ten/hundred (easy visual comparison)
- Round 2: Decimal rounding to the nearest tenth (medium)
- Round 3: Mixed estimates from a computed sum/product, e.g., "218 + 396 ≈ 600" (hard — tests understanding of estimation, not just rounding)

### 6.3 Station C — "Build the Estimate Equation" (Abstract)

**Visual:**

```
Round①: ___    (operation: + / − / × / ÷)    Round②: ___    ≈    Estimate: ___
```

(one blank highlighted for input; the other values are given)

**Interaction:**

- Number-pad input (large tap-friendly digit pad + place-value stepper)
- Benchmark number line shown above as a visual scaffold
- "Show me the number line" hint button always visible
- On submit: correct → bounce animation; incorrect → shake + hint

**Variants (which blank is missing, rotated per round):**

- Find the estimate: `Round 58 → ___ , Round 24 → ___ , 58 + 24 ≈ ___`
- Find a rounded value: `Round 6.82 to the nearest tenth: ___`
- Find the operation's compatible numbers: `396 ÷ 21 ≈ ___ ÷ ___ = ___`

ElevenLabs narrates each sentence aloud when displayed.

---

## 7. Phase 4 — Question Bank (100 Randomized Questions)

### 7.1 Question Types (10 types × 10 questions = 100 total)

| Type | Description                                                       | Example                                                                                     |
| ---- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Q1   | Round a whole number to the nearest 10/100/1,000/10,000             | Round 4,286 to the nearest hundred.                                                           |
| Q2   | Round a decimal to the nearest whole/tenth/hundredth                | Round 7.836 to the nearest hundredth.                                                         |
| Q3   | Estimate a sum by rounding                                          | Estimate 384 + 219 by rounding each number to the nearest hundred.                            |
| Q4   | Estimate a difference by rounding                                   | Estimate 812 − 347 by rounding each number to the nearest hundred.                            |
| Q5   | Estimate a product using rounding or compatible numbers             | Estimate 58 × 31 using compatible numbers.                                                    |
| Q6   | Estimate a quotient using compatible numbers                        | Estimate 396 ÷ 21 using compatible numbers.                                                   |
| Q7   | Real-world word problem — estimation (shopping, travel, budgeting)  | Emma buys items priced $8.75, $12.40, and $3.60. About how much does she spend altogether?    |
| Q8   | True or False — is this estimate reasonable?                        | "268 rounded to the nearest ten is 260." True or False?                                        |
| Q9   | Choose the best estimation strategy for a problem                   | Which strategy best estimates 4,982 + 3,015 — front-end estimation or rounding to hundreds?   |
| Q10  | Judge reasonableness / over- vs. under-estimate direction           | Priya rounds both numbers up before multiplying. Will her estimate be higher or lower than the exact product? |

### 7.2 Question Distribution by Difficulty

| Type      | Count   | Easy   | Medium | Hard   |
| --------- | ------- | ------ | ------ | ------ |
| Q1        | 10      | 4      | 4      | 2      |
| Q2        | 10      | 3      | 4      | 3      |
| Q3        | 10      | 4      | 4      | 2      |
| Q4        | 10      | 4      | 4      | 2      |
| Q5        | 10      | 3      | 4      | 3      |
| Q6        | 10      | 3      | 4      | 3      |
| Q7        | 10      | 3      | 4      | 3      |
| Q8        | 10      | 4      | 3      | 3      |
| Q9        | 10      | 3      | 4      | 3      |
| Q10       | 10      | 3      | 3      | 4      |
| **TOTAL** | **100** | **34** | **38** | **28** |

### 7.3 Number Ranges by Difficulty

- **Easy:** Whole numbers up to 4 digits rounded to the nearest 10/100; simple 2–3 digit sum/difference estimates
- **Medium:** Decimals to the hundredths place; 2–4 digit products/quotients using compatible numbers; multi-step word problems
- **Hard:** 5-digit numbers rounded to the nearest thousand/ten-thousand; multi-step word problems requiring two estimation steps; strategy-choice and over/under-estimate reasoning questions

### 7.4 Global Context — Names, Places & Objects Used in Word Problems

**Names (global set):** John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, Yuki, Priya, Fatima, Diego, Chloe, Ravi

**Cities/Landmarks:** London, New York, Tokyo, Sydney, Paris, Cairo, Rio de Janeiro, Cape Town, Mumbai, Reykjavik

**Contexts:** grocery/market shopping, stadium and concert crowd counts, school fundraiser totals, travel-budget planning, distance between cities, receipts and price tags, population figures, sports statistics

### 7.5 Language & Notation Requirements

All questions use globally recognized rounding/estimation vocabulary and notation:

- The approximation symbol **≈** ("is approximately equal to")
- Explicit place-value phrasing: "nearest ten," "nearest hundred," "nearest tenth," "nearest hundredth"
- "estimate", "about", "roughly", "compatible numbers", "front-end estimation", "reasonable", "overestimate", "underestimate"
- Currency questions use a single consistent symbol per question (e.g., **$**) to avoid notation confusion

---

## 8. Gamification Design

### 8.1 Reward System

- **Stars (⭐):** Earned per 10-question world (1–3 stars based on score)
- **XP Points:** 10 XP correct first try | 7 XP second try | 5 XP with hint used
- **Streak 🔥:** Fire counter for consecutive correct answers
- **Streak Bonus:** +5 XP per correct answer when streak ≥ 5

### 8.2 Badges (Unlockable)

- 🏅 **"Squad Recruit"** — Complete Wonder + Story phases
- 🥈 **"Number Line Navigator"** — Complete all 3 Simulation stations
- 🥇 **"Estimation Champion"** — Score ≥80% on Play phase
- 💎 **"Perfect Round"** — Score 10/10 in any world
- 🔥 **"Streak Star"** — Achieve a streak of 10 consecutive correct answers
- 🌍 **"Global Estimator"** — Complete all 6 phases (lesson complete badge)
- 🎯 **"Sharp Eye"** — Get 5 correct in Station B without any wrong pick
- 🧮 **"Compatible Numbers Pro"** — Correctly solve 5 estimate-product/quotient questions using compatible numbers

### 8.3 Feedback Mechanics

**✅ Correct:**
- Bounce animation on answer card + mascot happy mood
- ElevenLabs celebration audio: "Amazing! That's a perfect estimate! 🎉"
- XP floats up from answer card (+10 / +7 / +5)
- Streak fire counter increments

**❌ Incorrect (Attempt 1):**
- Gentle shake animation + ElevenLabs: "Not quite! Let's look at the benchmark numbers again 🔢"
- Hint 1 activates: number line diagram highlighted with the given values labeled

**❌ Incorrect (Attempt 2):**
- Stronger shake + Hint 2: animated marker shows the rounding step by step
- ElevenLabs: "Watch which benchmark it's closer to! Can you see it with me?"

**❌ Incorrect (Attempt 3):**
- Answer revealed with animated explanation (mascot explains)
- ElevenLabs: full explanation read aloud
- No score penalty — encouragement only

No negative scoring. Encouragement-first approach always.

### 8.4 World Map (IntelliPlay™ Level Progression — Global Landmarks)

1. **World 1 — "London Market Square"** (Q1–10, whole-number rounding, easy)
2. **World 2 — "New York Receipt Row"** (Q11–20, sum/difference estimates, easy-medium)
3. **World 3 — "Paris Bakery Counter"** (Q21–30, decimal rounding, medium)
4. **World 4 — "Tokyo Bullet Station"** (Q31–40, product estimates, medium)
5. **World 5 — "Sydney Stadium Bowl"** (Q41–50, medium-hard, crowd/quotient estimates)
6. **World 6 — "Cairo Desert Caravan"** (Q51–60, hard, multi-step word problems)
7. **World 7 — "Rio Carnival Crowd"** (Q61–70, hard, true/false reasonableness)
8. **World 8 — "Cape Town Safari Trail"** (Q71–80, hard, strategy-choice questions)
9. **World 9 — "Mumbai Local Express"** (Q81–90, hard, mixed all types)
10. **World 10 — "Reykjavik Aurora Trek"** (Q91–100, hardest, over/under-estimate reasoning)

**Unlock gate:** ≥6/10 correct (1-star minimum) required to advance to the next world.
3 stars in a world unlocks a hidden "Bonus Challenge" (3 extra questions).

### 8.5 Mascot (Rounder — Estimation Squad Companion)

- **Character:** A friendly rounding-dial robot named **"Rounder"** — its chest displays a spinning benchmark dial
- **Mood States:** idle | curious | happy | thinking | celebrating | encouraging
- **Appearances:** Wonder hook, Story narration, Simulation feedback, Reflect phase
- **Reactions:** Correct answer, badge unlock, streak milestone, world completion
- **Audio:** All mascot speech via ElevenLabs Alice voice (pre-generated .mp3)

---

## 9. Audio & Narration Design

Fully aligned with `audio_generation_pipeline.md`.

### 9.1 Pipeline Summary

- **Voice Provider:** ElevenLabs (only — no browser Web Speech API fallback)
- **Voice Name:** Alice (Clear, Engaging Educator)
- **Voice ID:** `Xb7hH8MSUJpSbSDYk0k2`
- **Model:** `eleven_multilingual_v2`
- **API Key Env Var:** `VITE_ELEVENLABS_API_KEY`
- **Pre-generation:** `scripts/generate_audio.js` → static `.mp3` in `public/assets/audio/`
- **Dynamic fallback:** Practice questions not yet cached are generated on-the-fly
- **Mapping:** Auto-generated `src/utils/audioMap.js` (exact text → file path)
- **Cleanup:** `scripts/clean_audio.js` removes orphaned audio files

### 9.2 Content Policy — Paragraphs & Questions ONLY

> **IMPORTANT:** Audio is generated ONLY for paragraph/story text and question text. Titles, headings, world names, and section labels are **never** narrated.

### 9.3 Speech Styles Mapped to ElevenLabs Settings

| Style                       | Stability | Similarity Boost | Style | Speaker Boost | Use case                      |
| ---------------------------- | --------- | ----------------- | ----- | --------------- | -------------------------------- |
| `celebration`                | 0.12      | 0.45               | 0.75  | ✅               | Badge unlock, world complete     |
| `encouragement`               | 0.16      | 0.50               | 0.65  | ✅               | Correct answer feedback          |
| `question`                    | 0.20      | 0.55               | 0.55  | ✅               | Practice question read-aloud     |
| `emphasis`                    | 0.16      | 0.50               | 0.60  | ✅               | Key vocabulary highlight         |
| `thinking`                    | 0.24      | 0.60               | 0.35  | ✅               | Mascot thinking moments          |
| `statement` / `instruction`   | 0.20      | 0.55               | 0.50  | ✅               | Story narration, instructions    |

### 9.4 Narration Script Examples

**Phase 1 (Wonder) — style: thinking**
> "Forty-two thousand one hundred eighty-seven people are at a stadium in Rio de Janeiro."
> "Sarah wants to tell her friend about how many people were there, without counting every single one."
> "Let's discover how rounding and estimation help us solve this fast!"

**Phase 2 (Story, Panel 2) — style: statement**
> "Mike is shopping in New York. His cart shows eighteen dollars and seventy-five cents, six dollars and forty cents, and eleven dollars and twenty cents."
> "About how much will he pay altogether?"

**Phase 3 (Station A) — style: instruction**
> "Slide the number along the line. Which benchmark is it closer to?"
> "Watch the marker snap into place. Did you round it correctly?"

**Phase 4 (Correct feedback) — style: celebration**
> "Amazing! That's a perfect estimate! You are an Estimation Squad superstar!"

**Phase 5 (Reflect) — style: thinking**
> "What an adventure today! Can you tell me one thing you estimated this week?"

### 9.5 Strict 1:1 Parity Rule

Every on-screen narrated string in `narration.js` must match the UI text **exactly** (same words, punctuation, capitalization). Any UI text change requires updating both `generate_audio.js`'s `phrases` array and `narration.js`.

---

## 10. UX & Visual Design Requirements

### 10.1 Visual Theme

- **Brand:** Intellia — Think. Explore. Become.
- **Reference UI (strict match):** `https://grade5-time-intervals.vercel.app/`
- **Reference Repo (strict match):** `https://github.com/p1pachare-cloud/Grade5-Time-Intervals`
- **Colours:** Match `grade5-time-intervals.vercel.app` exactly — primary brand blue, accent gold/yellow for rewards, soft coral/red for wrong-answer states, white card backgrounds, soft drop shadows, distinct phase-band colours
- **Typography:** Rounded, playful — Nunito or Fredoka One
- **Illustrations:** Cartoon-style, globally inclusive character designs and landmark backdrops (Big Ben, Statue of Liberty, Eiffel Tower, Sydney Opera House, Tokyo skyline, etc.)
- **Number Line Components:** Large, clean SVG number lines with labeled benchmark ticks and an animatable marker; distinct colour per world/landmark

### 10.2 Layout Structure (mirrors grade5-time-intervals.vercel.app)

- **Top Bar:** Intellia logo | Lesson title "Rounding & Estimation" | 6-phase dot tracker
- **Main Area:** Phase content (fills screen, responsive, smooth phase transitions)
- **Bottom Bar:** XP counter | Star count | Streak fire | Phase navigation arrows
- **Sidebar:** Hidden on mobile; shown on tablet+ as vertical phase map

### 10.3 Number Line & Estimate Diagram Visual Component (Primary Visual)

Used throughout all phases:

- Large SVG number line with labeled benchmark ticks (whole numbers, tens, hundreds, tenths, hundredths depending on question)
- Animatable marker showing the exact value and its rounded/snapped position
- Estimate-vs-exact comparison bar (two stacked horizontal bars) for word-problem feedback
- Missing value shown as a dashed-outline marker or "?" flag
- Marker/segments animate (smooth transition) when the diagram first renders or updates

### 10.4 Accessibility

- Large tap targets (minimum 44×44px on all interactive elements)
- WCAG AA colour contrast on all text elements
- All narration via ElevenLabs (premium, consistent voice)
- Keyboard navigable (Tab + Enter for all interactions)
- No mandatory time pressure (optional timer toggle in challenge mode only)
- Drag interactions have touch-equivalent tap+tap fallback

### 10.5 Responsive Design

- Primary: Desktop browser (1024px+) and tablet (768px+) — classroom context
- Secondary: iPad/tablet
- Tertiary: Mobile (375px+) — stacked single-column layout

---

## 11. Content Requirements

### 11.1 Simulation Visuals

- Number line diagrams: SVG-rendered lines with animated marker + digital readout
- Estimate-vs-exact comparison cards: pictured quantities (coin jars, crowds, receipts) with printed estimate captions
- Station C sentences: large bold typography, one highlighted blank per round

### 11.2 Question Bank Coverage

- All 10 question types × 10 questions = 100 unique question objects in `questionBank.js`
- Questions randomized per session using Fisher-Yates shuffle
- No two sessions present the same question order
- MCQ distractors always plausible (wrong place value, wrong rounding direction, or an off-by-one-benchmark error)

### 11.3 Word Problem Formats

**Shopping/budgeting sense:**
> "[Name] buys items priced [$price A], [$price B], and [$price C]. About how much does [he/she] spend altogether?"

**Crowd/measurement sense:**
> "[Location] reports [exact large number] [people/seats/units]. Round this to the nearest [benchmark] to estimate the total."

**Extended "Check the Answer" sense:**
> "[Name] calculated [exact expression] and got [claimed answer]. Use estimation to decide if this answer is reasonable."

### 11.4 Audio Script Parity (Strict 1:1 Rule)

Every on-screen text string that is narrated must match `narration.js` exactly — same words, same punctuation. Any UI text change requires updating both the `generate_audio.js` phrases array and `narration.js`.

---

## 12. Success Criteria (v1.0)

| Criterion                                        | Target     |
| -------------------------------------------------- | ---------- |
| All 100 questions randomized correctly              | ✅ Required |
| All 3 simulation stations functional                | ✅ Required |
| All 6 phases navigable end-to-end                   | ✅ Required |
| Gamification (XP, stars, 8 badges) working          | ✅ Required |
| World map 10-world progression logic correct        | ✅ Required |
| ElevenLabs audio plays for all phase narration      | ✅ Required |
| Audio pipeline (pre-gen + dynamic) functional       | ✅ Required |
| Mobile/tablet/desktop responsive layout             | ✅ Required |
| Global Grade 7 syllabus coverage confirmed          | ✅ Required |
| Loads in < 3 seconds (Vite production build)        | ✅ Required |
| WCAG AA accessible                                  | ✅ Required |
| UI matches grade5-time-intervals.vercel.app structure | ✅ Required |
| Hosted correctly at Intellia Grade 7 lesson URL     | ✅ Required |

---

## 13. Out of Scope (v1.0)

- Teacher dashboard / backend analytics
- Student login / account persistence across devices
- Multiplayer or class competition features
- Parent progress report emails
- Print worksheet generation
- Significant-figures notation for scientific contexts — reserved for a future advanced module
- Assessment against the full curriculum (broader test engine)

---

**Document Version:** 1.0 | September 2026
**Product:** Intellia — Grade 7 Math, Rounding & Estimation
**Lesson Title:** Global Estimation Squad — Rounding & Estimation
**Curriculum:** Global Grade 7 Mathematics (Common Core, Singapore MOE, UK NC, CBSE, Australian Curriculum cross-aligned)
**Reference UI:** https://grade5-time-intervals.vercel.app/
**Reference Repo:** https://github.com/p1pachare-cloud/Grade5-Time-Intervals
**Audio Pipeline:** ElevenLabs (Alice, `Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`) — per `audio_generation_pipeline.md`
**Parent Course Page:** https://intelliasg.com/courses/grade-7-math/
**Lesson URL:** https://intelliasg.com/courses/grade-7-math/lessons/rounding-and-estimation/
