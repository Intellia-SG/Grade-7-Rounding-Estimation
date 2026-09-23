# Technical Requirements Document (TRD)
## Rounding & Estimation — Number Sense & Reasonable Answers | Grade 7 Math
### Intellia | Global Grade 7 Mathematics Curriculum

---

## 1. Technical Overview

This document specifies the architecture, component design, state management, data models, simulation logic, gamification implementation, audio pipeline, and quality standards for the **"Global Estimation Squad — Rounding & Estimation"** interactive lesson module for Grade 7 Math.

The module is a **React 18 application (Vite + JSX)**, structured identically to the reference repository **https://github.com/p1pachare-cloud/Grade5-Time-Intervals**, and styled to strictly match **https://grade5-time-intervals.vercel.app/**. It will be embedded at:

```
https://intelliasg.com/courses/grade-7-math/lessons/rounding-and-estimation/
```

Audio narration uses **ElevenLabs exclusively** (no browser Web Speech API fallback), directly implementing the pipeline documented in `audio_generation_pipeline.md`, adapted for this lesson's scripts.

---

## 2. Technology Stack

| Layer            | Technology                                       | Rationale                                |
| ------------------ | --------------------------------------------------- | ------------------------------------------- |
| UI Framework      | React 18 (JSX, Vite)                                 | Matches reference repo structure           |
| State Management  | `useState` + `useReducer`                            | Sufficient for single-module complexity    |
| Styling           | CSS Modules + Tailwind                               | Matches existing repo CSS approach         |
| Icons             | Lucide React                                          | Available in artifact environment          |
| Animation         | CSS keyframes + transitions                           | No external dependency needed              |
| SVG Diagrams      | Inline SVG (React)                                    | Number-line marker + estimate comparison bars |
| Persistence       | `localStorage`                                        | Session state, no backend needed           |
| Audio (Primary)   | ElevenLabs API                                         | Premium, consistent voice (Alice)          |
| Audio (Playback)  | HTML5 Audio API (`new Audio()`)                        | Browser-native, no library needed          |
| Number Math       | Vanilla JS (rational-number-safe rounding utilities)   | Avoids floating-point rounding pitfalls    |
| Build Tool        | Vite                                                   | Matches reference repo (`vite.config.js`)  |

---

## 3. Project Structure (mirrors `Grade5-Time-Intervals` repo)

```
rounding-and-estimation/
├── public/
│   ├── assets/
│   │   ├── audio/                        # Pre-generated .mp3 files (ElevenLabs)
│   │   │   ├── audio_wonder_hook_0.mp3
│   │   │   ├── audio_story_panel1_0.mp3
│   │   │   ├── audio_story_panel2_0.mp3
│   │   │   ├── audio_story_panel3_0.mp3
│   │   │   ├── audio_story_panel4_0.mp3
│   │   │   ├── audio_story_panel5_0.mp3
│   │   │   ├── audio_story_panel6_0.mp3
│   │   │   ├── audio_station_a_instruction_0.mp3
│   │   │   ├── audio_station_b_instruction_0.mp3
│   │   │   ├── audio_station_c_instruction_0.mp3
│   │   │   ├── audio_correct_0.mp3
│   │   │   ├── audio_reflect_prompt_0.mp3
│   │   │   └── ... (all phase phrases pre-generated)
│   │   └── images/
│   │       ├── mascot-idle.svg
│   │       ├── mascot-happy.svg
│   │       ├── mascot-thinking.svg
│   │       ├── mascot-celebrate.svg
│   │       └── world-map-bg.svg
├── src/
│   ├── main.jsx                          # React entry point
│   ├── App.jsx                           # Root component, global state (useReducer)
│   ├── App.css                           # Global styles (mirrors reference CSS)
│   ├── components/
│   │   ├── IntroScreen.jsx               # Welcome + lesson overview + phase dot tracker
│   │   ├── ProgressMap.jsx               # 6-phase dot tracker (top bar)
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx           # Phase 1: Hook animation + ElevenLabs narration
│   │   │   ├── StoryPhase.jsx            # Phase 2: Illustrated narrative panels
│   │   │   ├── SimulatePhase.jsx         # Phase 3: Simulation station wrapper
│   │   │   ├── PlayPhase.jsx             # Phase 4: IntelliPlay™ quiz engine
│   │   │   └── ReflectPhase.jsx          # Phase 5: Journal + completion badge
│   │   ├── simulations/
│   │   │   ├── NumberLineStation.jsx     # Station A: Drag/snap marker to nearest benchmark
│   │   │   ├── EstimateOrExactStation.jsx# Station B: Visual estimate-matching
│   │   │   └── EstimateEquationStation.jsx# Station C: Fill "Round + Round ≈ Estimate"
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx      # Polymorphic dispatcher → type-specific component
│   │   │   ├── RoundWholeNumberQ.jsx     # Q1: Round a whole number
│   │   │   ├── RoundDecimalQ.jsx         # Q2: Round a decimal
│   │   │   ├── EstimateSumQ.jsx          # Q3: Estimate a sum
│   │   │   ├── EstimateDifferenceQ.jsx   # Q4: Estimate a difference
│   │   │   ├── EstimateProductQ.jsx      # Q5: Estimate a product
│   │   │   ├── EstimateQuotientQ.jsx     # Q6: Estimate a quotient
│   │   │   ├── WordProblemQ.jsx          # Q7: Real-world estimation word problem
│   │   │   ├── TrueFalseEstimateQ.jsx    # Q8: True/False — is this estimate reasonable?
│   │   │   ├── StrategyChoiceQ.jsx       # Q9: Choose the best estimation strategy
│   │   │   ├── ReasonablenessQ.jsx       # Q10: Over/under-estimate reasoning
│   │   │   └── HintOverlay.jsx           # Hint 1 & 2 + animated explanation after 3 fails
│   │   ├── gamification/
│   │   │   ├── XPTracker.jsx             # XP bar + floating XP animation
│   │   │   ├── StarRating.jsx            # 1–3 star rating per world
│   │   │   ├── BadgePanel.jsx            # Badge unlock toast + panel
│   │   │   ├── StreakCounter.jsx         # Fire streak counter
│   │   │   └── WorldMap.jsx              # 10-world progress map (horizontal scroll)
│   │   └── shared/
│   │       ├── Mascot.jsx                # "Rounder" rounding-dial robot with mood states
│   │       ├── NumberLine.jsx            # Reusable SVG: number line with animated marker
│   │       ├── EstimateCompareBar.jsx    # Reusable SVG/HTML: estimate-vs-exact bar
│   │       ├── BenchmarkTray.jsx         # Selectable benchmark-place-value tray
│   │       ├── NumberPad.jsx             # Large tap-friendly digit input pad
│   │       └── FeedbackOverlay.jsx       # Correct/incorrect overlay with animation
│   ├── data/
│   │   ├── questionBank.js               # 100 question objects (all types)
│   │   └── storyContent.js               # Story phase panel data (text + visuals)
│   ├── hooks/
│   │   ├── useAudio.js                   # ElevenLabs + HTML5 Audio playback hook
│   │   ├── useGameState.js               # Gamification state hook
│   │   └── useLocalStorage.js            # Session persistence hook (24hr resume)
│   └── utils/
│       ├── audioMap.js                   # AUTO-GENERATED: text → .mp3 path map
│       ├── roundingMath.js               # Rounding + estimation arithmetic (core engine)
│       ├── shuffle.js                    # Fisher-Yates randomization
│       ├── scoring.js                    # XP + star calculation + distractor gen
│       └── badgeEngine.js                # Badge unlock condition logic
├── scripts/
│   ├── generate_audio.js                 # Offline ElevenLabs audio pre-generation
│   └── clean_audio.js                    # Remove orphaned .mp3 files
├── api/
│   └── elevenlabs.js                     # ElevenLabs proxy (if server-side key needed)
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

---

## 4. Application State Architecture

### 4.1 Global State (`App.jsx` — `useReducer`)

```javascript
const initialState = {
  // Navigation
  phase: 'intro',            // 'intro'|'wonder'|'story'|'simulate'|'play'|'reflect'|'results'
  storyPanel: 0,               // 0–5 (6 story panels)
  currentSimStation: 0,        // 0=NumberLine, 1=EstimateOrExact, 2=EstimateEquation
  simStationsComplete: [false, false, false],
  simRound: 0,                  // Round index within current station (0–3)

  // Play / Challenge phase
  questionSet: [],              // 100 shuffled Question objects
  currentQuestion: 0,           // 0–99
  currentWorld: 0,              // 0–9 (10 worlds)
  worldScores: Array(10).fill(null),
  hintsUsed: 0,
  attemptCount: 0,              // Attempts on current question (max 3)

  // Gamification
  xp: 0,
  totalStars: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],                   // Array of unlocked badge IDs
  compatibleNumberCorrect: 0,    // Tracks "Compatible Numbers Pro" badge progress

  // Session metadata
  phaseComplete: {
    wonder: false, story: false, simulate: false,
    play: false, reflect: false,
  },
  sessionId: crypto.randomUUID(),

  // Settings
  audioEnabled: true,           // ElevenLabs narration on/off
  musicEnabled: false,          // Background ambient music (off by default)
  roundingUnit: 'auto',         // 'auto' | forced place-value override for practice mode
};
```

### 4.2 Reducer Action Types

```javascript
const ACTIONS = {
  SET_PHASE: 'SET_PHASE',
  NEXT_STORY_PANEL: 'NEXT_STORY_PANEL',
  ADVANCE_SIM_STATION: 'ADVANCE_SIM_STATION',
  COMPLETE_SIM_STATION: 'COMPLETE_SIM_STATION',
  NEXT_SIM_ROUND: 'NEXT_SIM_ROUND',
  LOAD_QUESTIONS: 'LOAD_QUESTIONS',
  ANSWER_CORRECT: 'ANSWER_CORRECT',
  ANSWER_INCORRECT: 'ANSWER_INCORRECT',
  USE_HINT: 'USE_HINT',
  NEXT_QUESTION: 'NEXT_QUESTION',
  UNLOCK_BADGE: 'UNLOCK_BADGE',
  COMPLETE_PHASE: 'COMPLETE_PHASE',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
  TOGGLE_MUSIC: 'TOGGLE_MUSIC',
  RESTORE_SESSION: 'RESTORE_SESSION',
  RESET_SESSION: 'RESET_SESSION',
};
```

### 4.3 Key Reducer Logic

```javascript
// ANSWER_CORRECT dispatch
case ACTIONS.ANSWER_CORRECT: {
  const xpEarned = calcXP(state.attemptCount + 1, state.hintsUsed, state.streak);
  const newStreak = state.streak + 1;
  const worldIndex = Math.floor(state.currentQuestion / 10);
  const newWorldScore = (state.worldScores[worldIndex] || 0) + 1;
  const updatedWorldScores = [...state.worldScores];
  updatedWorldScores[worldIndex] = newWorldScore;

  return {
    ...state,
    xp: state.xp + xpEarned,
    streak: newStreak,
    maxStreak: Math.max(state.maxStreak, newStreak),
    worldScores: updatedWorldScores,
    totalStars: calcTotalStars(updatedWorldScores),
    hintsUsed: 0,
    attemptCount: 0,
  };
}

// ANSWER_INCORRECT dispatch
case ACTIONS.ANSWER_INCORRECT: {
  return {
    ...state,
    streak: 0,
    attemptCount: state.attemptCount + 1,
  };
}
```

---

## 5. Rounding & Estimation Math Engine (`utils/roundingMath.js`)

All rounding is performed on **integer-scaled values** (multiplying decimals by powers of 10 before rounding, then dividing back) to avoid IEEE-754 floating-point rounding errors (e.g., `1.005` naively rounding down).

```javascript
// Round a number to the nearest given place value ('ten'|'hundred'|'thousand'|'ten-thousand')
export function roundToPlace(value, place) {
  const factors = { ten: 10, hundred: 100, thousand: 1000, 'ten-thousand': 10000 };
  const factor = factors[place];
  return Math.round(value / factor) * factor;
}

// Round a decimal to a given number of decimal places (avoids float drift via scaling)
export function roundToDecimalPlaces(value, places) {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

// Estimate a sum/difference by rounding both operands to the same place value first
export function estimateSumOrDifference(a, b, place, operation) {
  const ra = roundToPlace(a, place);
  const rb = roundToPlace(b, place);
  return operation === 'add' ? ra + rb : ra - rb;
}

// Estimate a product/quotient using compatible numbers (nearest values that divide/multiply cleanly)
export function estimateWithCompatibleNumbers(a, b, operation) {
  const ca = nearestCompatible(a, operation, 'first');
  const cb = nearestCompatible(b, operation, 'second');
  return operation === 'multiply' ? ca * cb : ca / cb;
}

// Finds a "friendly" nearby number for compatible-number estimation
// (rounds to 1 significant figure by default; division favors clean divisors)
function nearestCompatible(value, operation, role) {
  const magnitude = 10 ** Math.floor(Math.log10(Math.abs(value)));
  if (operation === 'divide' && role === 'second') {
    // Prefer small clean divisors: 2, 5, 10, 20, 25, 50, 100...
    const cleanDivisors = [2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
    return cleanDivisors.reduce((best, d) =>
      Math.abs(d - value) < Math.abs(best - value) ? d : best
    );
  }
  return Math.round(value / magnitude) * magnitude;
}

// Determines whether a rounded value is an overestimate or underestimate of the original
export function estimateDirection(original, rounded) {
  if (rounded > original) return 'overestimate';
  if (rounded < original) return 'underestimate';
  return 'exact';
}

// Human-readable place-value label, e.g. "nearest hundred"
export function formatPlaceLabel(place) {
  const labels = {
    ten: 'nearest ten', hundred: 'nearest hundred',
    thousand: 'nearest thousand', 'ten-thousand': 'nearest ten-thousand',
    tenth: 'nearest tenth', hundredth: 'nearest hundredth',
    whole: 'nearest whole number',
  };
  return labels[place] ?? place;
}
```

All number-line UI components (`NumberLine.jsx`, `EstimateCompareBar.jsx`, `NumberPad.jsx`) consume and emit **plain numeric values plus an explicit place-value string** — no implicit floating-point rounding is ever performed inline in a component; every rounding operation routes through `roundingMath.js`, eliminating float-precision bugs entirely.

---

## 6. Question Data Model

### 6.1 Question Schema

```typescript
interface Question {
  id: string;                    // e.g. "Q1_003", "Q7_008"
  type: QuestionType;            // One of 10 enum values (see below)
  world: number;                 // 0–9 (which world this belongs to)
  difficulty: 1 | 2 | 3;         // 1=easy, 2=medium, 3=hard

  // Core numeric values
  operandA?: number;
  operandB?: number;
  exactValue?: number;
  place?: 'ten' | 'hundred' | 'thousand' | 'ten-thousand' | 'tenth' | 'hundredth' | 'whole';
  operation?: 'add' | 'subtract' | 'multiply' | 'divide';

  // Rendering
  questionText: string;          // Full narrated question text (ElevenLabs reads this)
  visual: VisualType;             // 'numberLine' | 'compareBar' | 'sentence' | 'cardGrid' | 'trueFalse'

  // MCQ
  options?: (string|number)[];   // 4 MCQ options (always includes correctAnswer)

  // Hints
  hint1: string;                  // Shown after 1 wrong attempt
  hint2: string;                  // Shown after 2 wrong attempts (animation trigger)
  explanation: string;            // Full text explanation after 3 fails (read aloud)

  // Word problems only
  characterName?: string;
  city?: string;
  contextObject?: string;         // 'receipt', 'stadium', 'train', 'market', 'homework'

  // True/False only
  isTrue?: boolean;

  // Strategy-choice only
  strategyOptions?: string[];      // e.g. ['Front-end estimation', 'Rounding to hundreds']

  // Answer
  correctAnswer: number | string;
}

type QuestionType =
  | 'round_whole_number'      // Q1
  | 'round_decimal'           // Q2
  | 'estimate_sum'            // Q3
  | 'estimate_difference'     // Q4
  | 'estimate_product'        // Q5
  | 'estimate_quotient'       // Q6
  | 'word_problem'            // Q7
  | 'true_false_estimate'     // Q8
  | 'strategy_choice'         // Q9
  | 'reasonableness';         // Q10

type VisualType =
  | 'numberLine'   // NumberLine marker snapping to benchmark
  | 'compareBar'   // Estimate-vs-exact EstimateCompareBar
  | 'sentence'     // "Round① ___ (op) Round② ___ ≈ ___" with highlighted blank
  | 'cardGrid'      // Grid of pictured-quantity + estimate-label cards
  | 'trueFalse';    // Statement + True/False buttons
```

### 6.2 Sample Question Objects

```javascript
// Q1 — Round a Whole Number
{
  id: "Q1_001",
  type: "round_whole_number",
  world: 0,
  difficulty: 1,
  exactValue: 4286,
  place: "hundred",
  questionText: "Round 4,286 to the nearest hundred.",
  visual: "numberLine",
  hint1: "Look at the tens digit — is it 4,200 or 4,300 that's closer?",
  hint2: "4,286 is closer to 4,300. The tens digit (8) tells us to round up!",
  explanation: "4,286 is between 4,200 and 4,300. Since 86 is more than halfway (50), it rounds up to 4,300.",
  options: [4200, 4300, 4290, 4000],
  correctAnswer: 4300,
}

// Q5 — Estimate a Product
{
  id: "Q5_004",
  type: "estimate_product",
  world: 3,
  difficulty: 2,
  operandA: 58,
  operandB: 31,
  operation: "multiply",
  questionText: "Estimate 58 × 31 using compatible numbers.",
  visual: "sentence",
  characterName: "Diego",
  hint1: "What friendly number is close to 58? What about 31?",
  hint2: "Try 60 × 30 — that's easy to multiply mentally!",
  explanation: "58 rounds to 60 and 31 rounds to 30. 60 × 30 = 1,800, so the estimate is about 1,800.",
  options: [1800, 1500, 2000, 1750],
  correctAnswer: 1800,
}

// Q7 — Word Problem (Shopping)
{
  id: "Q7_002",
  type: "word_problem",
  world: 2,
  difficulty: 2,
  operandA: 8.75,
  operandB: 12.40,
  questionText: "Emma buys items priced $8.75, $12.40, and $3.60. About how much does she spend altogether?",
  visual: "compareBar",
  characterName: "Emma",
  contextObject: "receipt",
  hint1: "Round each price to the nearest dollar first.",
  hint2: "$8.75 ≈ $9, $12.40 ≈ $12, $3.60 ≈ $4. Now add them!",
  explanation: "Rounding each price gives $9 + $12 + $4 = $25, so Emma spends about $25 altogether.",
  options: ["$25", "$22", "$28", "$24.75"],
  correctAnswer: "$25",
}

// Q10 — Reasonableness / Over-Underestimate
{
  id: "Q10_005",
  type: "reasonableness",
  world: 9,
  difficulty: 3,
  operandA: 396,
  operandB: 21,
  operation: "multiply",
  questionText: "Priya rounds both numbers up before multiplying 396 × 21. Will her estimate be higher or lower than the exact product?",
  visual: "trueFalse",
  characterName: "Priya",
  hint1: "If both numbers get bigger before multiplying, what happens to the product?",
  hint2: "Rounding up both factors makes the product bigger than the real answer.",
  explanation: "Rounding both 396 and 21 up (to 400 and a larger ten) makes each factor bigger, so the estimate will be an overestimate — higher than the exact product.",
  options: ["Higher (overestimate)", "Lower (underestimate)", "Exactly the same", "Cannot be determined"],
  correctAnswer: "Higher (overestimate)",
}
```

---

## 7. Number Line & Estimate Comparison SVG Components

### 7.1 `NumberLine.jsx` — Reusable Animated Number Line

```javascript
// NumberLine.jsx — animatable marker rendered along a labeled benchmark scale
const NumberLine = ({
  exactValue,             // The precise value to plot
  roundedValue,            // The snapped/rounded value (nullable until answered)
  minTick,                 // Lower bound benchmark
  maxTick,                 // Upper bound benchmark
  tickStep,                // Spacing between labeled ticks
  size = 'medium',          // 'small' | 'medium' | 'large'
  animated = false,
}) => {
  const width = size === 'large' ? 640 : size === 'medium' ? 480 : 320;
  const scaleX = (value) => ((value - minTick) / (maxTick - minTick)) * width;
  const ticks = [];
  for (let t = minTick; t <= maxTick; t += tickStep) ticks.push(t);

  return (
    <svg viewBox={`0 0 ${width} 100`} xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="50" x2={width} y2="50" stroke="#4A90D9" strokeWidth="4" />
      {ticks.map((t) => (
        <g key={t} transform={`translate(${scaleX(t)}, 50)`}>
          <line y1="-10" y2="10" stroke="#4A90D9" strokeWidth="3" />
          <text y="30" textAnchor="middle" fontSize="14">{t}</text>
        </g>
      ))}
      {/* Exact-value marker (dashed while unresolved) */}
      <circle
        cx={scaleX(exactValue)} cy="50" r="8"
        fill="#FF7A59"
        className={animated ? 'marker-animated' : ''}
      />
      {/* Snapped/rounded marker, shown once resolved */}
      {roundedValue != null && (
        <circle cx={scaleX(roundedValue)} cy="50" r="10" fill="none" stroke="#2ECC71" strokeWidth="3" />
      )}
    </svg>
  );
};
```

Animation variants:

- `animated=true` → CSS transition on the marker's `cx` (600ms ease-in-out) whenever it snaps to a new tick
- `shake` variant → CSS `shake` keyframe applied to `.number-line-wrapper` on wrong answer
- `bounce` variant → CSS `bounceIn` keyframe applied to the snapped marker on correct answer

### 7.2 `EstimateCompareBar.jsx` — Estimate vs. Exact Visual

```javascript
// EstimateCompareBar.jsx — two stacked horizontal bars comparing an estimate to the exact value
const EstimateCompareBar = ({ exactValue, estimateValue, maxScale, label }) => {
  const pctExact = Math.min(100, (exactValue / maxScale) * 100);
  const pctEstimate = Math.min(100, (estimateValue / maxScale) * 100);
  return (
    <div className="compare-bar-wrapper">
      <div className="compare-bar-row">
        <span className="compare-bar-label">Exact</span>
        <div className="compare-bar-track">
          <div className="compare-bar-fill exact" style={{ width: `${pctExact}%` }} />
        </div>
        <span className="compare-bar-value">{exactValue}</span>
      </div>
      <div className="compare-bar-row">
        <span className="compare-bar-label">Estimate</span>
        <div className="compare-bar-track">
          <div className="compare-bar-fill estimate" style={{ width: `${pctEstimate}%` }} />
        </div>
        <span className="compare-bar-value">{estimateValue}</span>
      </div>
      {label && <p className="compare-bar-caption">{label}</p>}
    </div>
  );
};
```

---

## 8. Simulation Station Component Specs

### 8.1 `NumberLineStation.jsx` — Station A (Concrete)

```javascript
const [round, setRound] = useState(getStationARound(state.simRound));
// round: { exactValue: 428, place: 'ten', minTick: 400, maxTick: 450, tickStep: 10 }
const [markerPosition, setMarkerPosition] = useState(null);  // Tick value student selected
const [submitted, setSubmitted] = useState(false);
```

**Interaction (Drag):**
- `NumberLine` renders a draggable exact-value marker; student drags it toward the nearest labeled tick
- `onDrop`: `markerPosition = nearestTick(dropX)`; marker animates to snap onto that tick
- A brief "distance" readout shows how far the exact value is from each neighboring tick

**Interaction (Tap fallback):**
- Tap a benchmark tick directly on the number line to select it as the rounded value

**Completion Check:**
- `markerPosition === roundToPlace(round.exactValue, round.place)` → correct
- Submit button appears once a tick has been selected
- On correct submit: mascot celebrates, ElevenLabs plays celebration audio
- On incorrect submit: shake + narration "Not quite — check which benchmark is closer!"

**Station A Rounds (4 rounds, randomized order):**
```javascript
{ exactValue: 428,   place: 'ten',          minTick: 400,   maxTick: 450,   tickStep: 10 }
{ exactValue: 3652,  place: 'hundred',       minTick: 3500,  maxTick: 3800,  tickStep: 100 }
{ exactValue: 7.86,  place: 'tenth',         minTick: 7.6,   maxTick: 8.0,   tickStep: 0.1 }
{ exactValue: 19500, place: 'thousand',      minTick: 18000, maxTick: 21000, tickStep: 1000 }
```

### 8.2 `EstimateOrExactStation.jsx` — Station B (Pictorial)

```javascript
const [cards, setCards] = useState(generateEstimateCards(round));
const [selected, setSelected] = useState([]);   // Indices of tapped cards
const [submitted, setSubmitted] = useState(false);
```

**Card Generation (`generateEstimateCards`):**
- Creates 4 cards, each with a pictured `quantity` (coin jar, crowd, receipt, distance bar) and a printed `claimedEstimate`
- 2–3 cards state a reasonable estimate; 1–2 are mismatched (wrong place value, wrong rounding direction)
- Each card renders an illustration plus the printed estimate label text

**Interaction:**
- Tap a card → border highlights (selected state)
- Multi-select allowed (student picks all cards where the label is reasonable)
- "Check" button submits selection
- On submit: correct cards glow green, wrong cards glow red (1.5s), then advance

**Rounds (3 rounds per station):**
- Round 1: Whole-number rounding to the nearest ten/hundred (easy)
- Round 2: Decimal rounding to the nearest tenth (medium)
- Round 3: Mixed estimates from a computed sum/product (hard)

### 8.3 `EstimateEquationStation.jsx` — Station C (Abstract)

```javascript
const [problem, setProblem] = useState(getSentenceProblem(state.simRound));
// problem: { operandA, operandB, place, operation, missingSlot }
const [inputValue, setInputValue] = useState(null);
const [showNumberLine, setShowNumberLine] = useState(false);
```

**Layout:**
```jsx
<div className="estimate-sentence-row">
  {missingSlot === 'roundA'
    ? <NumberBlankInput value={inputValue} />
    : <span className="given-value">{roundToPlace(problem.operandA, problem.place)}</span>}
  <span className="op-symbol">{OP_SYMBOLS[problem.operation]}</span>
  {missingSlot === 'roundB'
    ? <NumberBlankInput value={inputValue} />
    : <span className="given-value">{roundToPlace(problem.operandB, problem.place)}</span>}
  <span className="approx-symbol">≈</span>
  {missingSlot === 'estimate'
    ? <NumberBlankInput value={inputValue} />
    : <span className="given-value">{computeEstimate(problem)}</span>}
</div>
<NumberPad value={inputValue} onChange={setInputValue} onSubmit={handleSubmit} />
<button onClick={() => setShowNumberLine(!showNumberLine)}>Show me the number line 🔢</button>
{showNumberLine && <NumberLine {...problem} />}
```

**Variants (rotated across 3 rounds):**
- Round 1: Find the estimate → `Round 58 → ___ , Round 24 → ___ , 58 + 24 ≈ ___`
- Round 2: Find a rounded value → `Round 6.82 to the nearest tenth: ___`
- Round 3: Find compatible numbers for division → `396 ÷ 21 ≈ ___ ÷ ___ = ___`

ElevenLabs reads the full sentence aloud when displayed.

---

## 9. Audio Pipeline (ElevenLabs — Matching `audio_generation_pipeline.md`)

### 9.1 Voice Configuration

- **Voice Name:** Alice
- **Voice ID:** `Xb7hH8MSUJpSbSDYk0k2`
- **Model:** `eleven_multilingual_v2`
- **API Key Var:** `VITE_ELEVENLABS_API_KEY` (in `.env.local`)

### 9.2 Speech Style Settings (per style type)

| Style                       | Stability | Similarity Boost | Style | Speaker Boost |
| ----------------------------- | --------- | ------------------- | ----- | ---------------- |
| `celebration`                  | 0.12      | 0.45                 | 0.75  | ✅                 |
| `encouragement`                 | 0.16      | 0.50                 | 0.65  | ✅                 |
| `question`                      | 0.20      | 0.55                 | 0.55  | ✅                 |
| `emphasis`                      | 0.16      | 0.50                 | 0.60  | ✅                 |
| `thinking`                      | 0.24      | 0.60                 | 0.35  | ✅                 |
| `statement` / `instruction`     | 0.20      | 0.55                 | 0.50  | ✅                 |

### 9.3 Offline Pre-generation Script (`scripts/generate_audio.js`)

```javascript
const phrases = [
  // Phase 1 — Wonder
  { text: "Forty-two thousand one hundred eighty-seven people are at a stadium in Rio de Janeiro.", style: 'thinking' },
  { text: "Sarah wants to tell her friend about how many people were there, without counting every single one.", style: 'question' },
  { text: "Let's discover how rounding and estimation help us solve this fast!", style: 'encouragement' },

  // Phase 2 — Story Panels
  { text: "John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, and Yuki form the Global Estimation Squad.", style: 'statement' },
  { text: "Mike is shopping in New York. His cart shows eighteen dollars and seventy-five cents, six dollars and forty cents, and eleven dollars and twenty cents.", style: 'statement' },
  { text: "About how much will he pay altogether?", style: 'question' },
  { text: "Priya in Mumbai reads that a train has three thousand nine hundred twelve seats. She rounds it to the nearest thousand — about four thousand seats!", style: 'emphasis' },
  { text: "Diego checks his math homework. He estimates using compatible numbers — four hundred times twenty equals eight thousand.", style: 'statement' },
  { text: "Every city, every receipt, every big number — rounding and estimation help us think fast and check our work!", style: 'emphasis' },

  // Phase 3 — Simulation Instructions
  { text: "Slide the number along the line. Which benchmark is it closer to?", style: 'instruction' },
  { text: "Watch the marker snap into place. Did you round it correctly?", style: 'question' },
  { text: "Look at these cards. Which estimates are reasonable? Tap to choose!", style: 'instruction' },
  { text: "Now fill in the missing number. What is a good estimate?", style: 'question' },

  // Phase 4 — Feedback
  { text: "Amazing! That's a perfect estimate! You are an Estimation Squad superstar!", style: 'celebration' },
  { text: "Not quite! Let's look at the benchmark numbers again.", style: 'encouragement' },
  { text: "Watch which benchmark it's closer to! Can you see it with me?", style: 'thinking' },

  // Phase 5 — Reflect
  { text: "What an adventure today! Can you tell me one thing you estimated this week?", style: 'thinking' },
  { text: "Lesson complete! You are a Global Estimation Squad Champion!", style: 'celebration' },

  // Badge unlocks
  { text: "Badge unlocked! You are a Squad Recruit!", style: 'celebration' },
  { text: "Badge unlocked! Number Line Navigator! You completed all three stations!", style: 'celebration' },
  { text: "Badge unlocked! Estimation Champion! You scored over eighty percent!", style: 'celebration' },
];

// Script hits ElevenLabs API for each phrase, saves to public/assets/audio/
// Auto-generates src/utils/audioMap.js mapping text → .mp3 path
// Rate-limits at 500ms between API calls (per audio_generation_pipeline.md)
```

### 9.4 Frontend Audio Engine (`src/hooks/useAudio.js`)

```javascript
// Step 1: Check audioMap for pre-generated static asset
// Step 2: If not found + API key present → fetch from ElevenLabs dynamically
// Step 3: Cache dynamic result in elevenLabsCache (in-memory Map)
// Step 4: Play via HTML5 Audio API (new Audio(url))
// Step 5: While segment i plays → preload segment i+1 (eager preload)

const elevenLabsCache = new Map(); // In-memory; cleared on page refresh

export async function getAudioUrl(text, style = 'statement', apiKey) {
  // 1. Static map check (fastest path)
  if (audioMap[text]) return audioMap[text];

  // 2. Memory cache check
  const cacheKey = `${text}::${style}`;
  if (elevenLabsCache.has(cacheKey)) return elevenLabsCache.get(cacheKey);

  // 3. Dynamic generation (requires API key)
  if (!apiKey) return null; // Silent skip — no fallback

  const styleSettings = STYLE_SETTINGS[style] ?? STYLE_SETTINGS.statement;
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/Xb7hH8MSUJpSbSDYk0k2`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: styleSettings,
      }),
    }
  );

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  elevenLabsCache.set(cacheKey, url);
  return url;
}

export async function narrate(segments, apiKey, onSegmentStart) {
  for (let i = 0; i < segments.length; i++) {
    const { text, style } = segments[i];
    const url = await getAudioUrl(text, style, apiKey);
    if (!url) continue; // Silent skip if no audio available

    // Eager preload next segment
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i + 1].text, segments[i + 1].style, apiKey);
    }

    if (onSegmentStart) onSegmentStart(i);
    await playAudio(url); // Resolves on 'ended' event
  }
}

async function playAudio(url) {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.onended = resolve;
    audio.onerror = resolve; // Silent fail — never block UX
    audio.play().catch(resolve);
  });
}
```

### 9.5 Audio Cleanup (`scripts/clean_audio.js`)

- Imports `audioMap.js` to determine all valid referenced `.mp3` paths
- Scans `public/assets/audio/` for all `.mp3` files
- Deletes any `.mp3` not present in `audioMap` (orphaned files)
- Run after any phrase deletion or text edit in `generate_audio.js`

### 9.6 Narration Synchronization Rules (1:1 Parity)

> **CRITICAL:** Every on-screen text string that is narrated must match `narration.js` **exactly** (same words, same punctuation, same capitalization). Titles, headings, and world names are **never** narrated.

Any UI text change requires:
1. Update `generate_audio.js` `phrases` array
2. Re-run: `node scripts/generate_audio.js`
3. Update corresponding text in the React UI component
4. Optionally run: `node scripts/clean_audio.js`

---

## 10. Randomization Engine

### 10.1 Fisher-Yates Shuffle (`utils/shuffle.js`)

```javascript
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSessionQuestions(bank) {
  const byType = {};
  bank.forEach(q => {
    if (!byType[q.type]) byType[q.type] = [];
    byType[q.type].push(q);
  });

  // Pick 10 from each type (shuffled), then shuffle the combined 100
  const selected = Object.values(byType)
    .flatMap(qs => shuffleArray(qs).slice(0, 10));

  return shuffleArray(selected);
}
```

### 10.2 MCQ Distractor Generation (`utils/scoring.js`)

```javascript
export function generateRoundingDistractors(correctValue, place, count = 3) {
  const distractors = new Set();
  const factor = PLACE_FACTORS[place] ?? 1;
  // Strategy: one tick below, one tick above, and a "wrong rounding direction" trap
  const candidates = [correctValue - factor, correctValue + factor, correctValue - factor / 2];
  candidates.forEach(d => {
    if (d !== correctValue && distractors.size < count) distractors.add(d);
  });
  while (distractors.size < count) {
    const d = correctValue + factor * (distractors.size + 2);
    if (d !== correctValue) distractors.add(d);
  }
  return shuffleArray([correctValue, ...distractors]);
}
```

### 10.3 Session Persistence (24-hour resume)

```javascript
const SESSION_KEY = 'intellia_rounding_estimation_v1';

// On app mount: restore if within 24 hours
const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
if (saved && Date.now() - saved.timestamp < 86400000) {
  dispatch({ type: ACTIONS.RESTORE_SESSION, payload: saved });
}

// On every state change: persist progress
useEffect(() => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    phase: state.phase,
    storyPanel: state.storyPanel,
    simStationsComplete: state.simStationsComplete,
    currentQuestion: state.currentQuestion,
    xp: state.xp,
    streak: state.streak,
    maxStreak: state.maxStreak,
    badges: state.badges,
    worldScores: state.worldScores,
    phaseComplete: state.phaseComplete,
    timestamp: Date.now(),
  }));
}, [state]);
```

---

## 11. Gamification Implementation

### 11.1 XP Calculation (`utils/scoring.js`)

```javascript
export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}
```

### 11.2 Star Rating (per world of 10 questions)

```javascript
export function calcStars(correct, total = 10) {
  if (correct >= 9) return 3; // Gold: ≥90%
  if (correct >= 7) return 2; // Silver: ≥70%
  if (correct >= 5) return 1; // Bronze: ≥50% (world unlock gate)
  return 0; // Try again
}

export function canUnlockWorld(worldScore) {
  return worldScore !== null && worldScore >= 5;
}

export function calcTotalStars(worldScores) {
  return worldScores.reduce((sum, ws) => sum + (ws !== null ? calcStars(ws) : 0), 0);
}
```

### 11.3 Badge Engine (`utils/badgeEngine.js`)

```javascript
export const BADGES = [
  {
    id: 'squad_recruit',
    label: '🏅 Squad Recruit',
    description: 'Complete Wonder and Story phases',
    condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story,
  },
  {
    id: 'number_line_navigator',
    label: '🥈 Number Line Navigator',
    description: 'Complete all 3 Simulation stations',
    condition: (s) => s.simStationsComplete.every(Boolean),
  },
  {
    id: 'estimation_champion',
    label: '🥇 Estimation Champion',
    description: 'Score 80%+ in Play phase',
    condition: (s) => {
      const totalCorrect = s.worldScores.reduce((sum, ws) => sum + (ws || 0), 0);
      return totalCorrect >= 80;
    },
  },
  {
    id: 'perfect_round',
    label: '💎 Perfect Round',
    description: 'Score 10/10 in any world',
    condition: (s) => s.worldScores.some(ws => ws === 10),
  },
  {
    id: 'streak_star',
    label: '🔥 Streak Star',
    description: 'Achieve a streak of 10 consecutive correct answers',
    condition: (s) => s.maxStreak >= 10,
  },
  {
    id: 'global_estimator',
    label: '🌍 Global Estimator',
    description: 'Complete all 6 phases',
    condition: (s) => Object.values(s.phaseComplete).every(Boolean),
  },
  {
    id: 'sharp_eye',
    label: '🎯 Sharp Eye',
    description: 'Complete Station B without any wrong selection',
    condition: (s) => s.stationBPerfect === true,
  },
  {
    id: 'compatible_numbers_pro',
    label: '🧮 Compatible Numbers Pro',
    description: 'Correctly solve 5 estimate-product/quotient questions using compatible numbers',
    condition: (s) => (s.compatibleNumberCorrect || 0) >= 5,
  },
];

export function checkBadges(state) {
  return BADGES
    .filter(b => !state.badges.includes(b.id) && b.condition(state))
    .map(b => b.id);
}

// Call after every state update that could unlock a badge:
const newBadges = checkBadges(newState);
if (newBadges.length > 0) {
  dispatch({ type: ACTIONS.UNLOCK_BADGE, payload: newBadges });
  newBadges.forEach(id => {
    const badge = BADGES.find(b => b.id === id);
    narrate([{ text: badge.description, style: 'celebration' }], apiKey);
  });
}
```

---

## 12. CSS Animation Keyframes (matching `grade5-time-intervals.vercel.app` style)

```css
@keyframes bounceIn {
  0%   { transform: scale(0.3); opacity: 0; }
  50%  { transform: scale(1.05); opacity: 1; }
  70%  { transform: scale(0.9); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-6px); }
  80%      { transform: translateX(6px); }
}

@keyframes floatUp {
  0%   { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-60px) scale(1.5); opacity: 0; }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74, 144, 217, 0.4); }
  50%      { box-shadow: 0 0 0 12px rgba(74, 144, 217, 0); }
}

@keyframes celebrate {
  0%   { transform: rotate(-5deg) scale(1); }
  25%  { transform: rotate(5deg) scale(1.1); }
  50%  { transform: rotate(-3deg) scale(1.05); }
  75%  { transform: rotate(3deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
}

@keyframes slideInUp {
  from { transform: translateY(30px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

@keyframes markerSnap {
  /* Applied via inline transform transition, not keyframes — see NumberLine.jsx */
  from { transform: translateX(var(--from-x)); }
  to   { transform: translateX(var(--to-x)); }
}

@keyframes barFill {
  from { width: 0%; }
  to   { width: var(--fill-percent); }
}

/* Stagger: each compare-bar row/tick gets animation-delay: (index * 120ms) */
```

---

## 13. Component Prop Contracts

| Component              | Props                                                                                       | Returns                                                                |
| ------------------------ | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `NumberLine`             | `{ exactValue, roundedValue?, minTick, maxTick, tickStep, size?, animated? }`                   | SVG number line with animated marker (inline, responsive)                  |
| `EstimateCompareBar`     | `{ exactValue, estimateValue, maxScale, label? }`                                                | Stacked estimate-vs-exact bar element                                      |
| `BenchmarkTray`          | `{ places, onSelect }`                                                                            | Flex row of selectable place-value chips (ten/hundred/tenth/etc.)         |
| `NumberPad`              | `{ value, onChange, onSubmit, allowDecimal? }`                                                    | Digit pad + place-value stepper (min 44×44px targets)                     |
| `Mascot`                 | `{ mood: 'idle'\|'happy'\|'thinking'\|'celebrating'\|'encouraging' }`                            | img/svg + CSS animation class mapped to mood                              |
| `QuestionRenderer`       | `{ question: Question, onAnswer: (answer) => void, hints: number }`                              | Type-specific question component                                          |
| `FeedbackOverlay`        | `{ isCorrect: boolean, explanation?: string, xpEarned: number, onContinue: () => void }`         | Animated modal overlay (bounceIn correct / shake wrong)                   |
| `WorldMap`               | `{ worldScores: (number\|null)[], currentWorld: number, onSelectWorld: (i) => void }`            | Horizontal scrollable world list with star ratings and lock icons         |
| `BadgePanel`             | `{ badges: string[], newBadgeId?: string }`                                                       | Badge grid with unlock toast animation for `newBadgeId`                   |

---

## 14. Performance Requirements

| Metric                            | Target                              |
| ------------------------------------ | ---------------------------------------- |
| Initial load time                     | < 2 seconds (Vite production build)      |
| Time to first meaningful paint        | < 1 second                                |
| SVG/number-line animation frame rate  | 60 fps                                    |
| Memory usage                          | < 60 MB                                    |
| Bundle size (gzipped)                 | < 600 KB                                   |
| Lighthouse Performance score          | ≥ 90                                       |
| Lighthouse Accessibility score        | ≥ 90                                       |
| ElevenLabs pre-gen audio TTFB         | 0ms (static .mp3 assets)                   |
| ElevenLabs dynamic audio TTFB         | < 2 seconds (API latency)                  |

---

## 15. Browser & Device Support

| Environment            | Support Level |
| ------------------------ | --------------- |
| Chrome 110+ (desktop)     | Full             |
| Safari 15+ (iPad/Mac)     | Full             |
| Firefox 110+              | Full             |
| Edge 110+                 | Full             |
| Android Chrome            | Full             |
| iOS Safari 15+            | Full             |
| IE 11                     | Not supported    |

Primary test device: Desktop Chrome (1280px+) and tablet (768px, touch) — classroom use context.

---

## 16. Quality & Testing Standards

- **Unit tests** for `roundingMath.js` covering: whole-number rounding at each place value, decimal rounding without float drift, midpoint ("exactly .5") rounding rules, compatible-number selection for multiplication and division, and over/underestimate direction detection
- **Snapshot tests** for `NumberLine`, `EstimateCompareBar`, and card-grid SVG components at each size variant
- **Randomization integrity test:** run `generateSessionQuestions()` 1,000 times and assert no two runs produce an identical question order
- **Accessibility audit:** automated Lighthouse + manual keyboard-navigation pass on all 6 phases
- **Audio parity check:** automated script diffs all narrated strings in `narration.js` against `generate_audio.js`'s `phrases` array to catch drift

---

**Document Version:** 1.0 | September 2026
**Product:** Intellia — Grade 7 Math, Rounding & Estimation
**Reference UI:** https://grade5-time-intervals.vercel.app/
**Reference Repo:** https://github.com/p1pachare-cloud/Grade5-Time-Intervals
**Audio Pipeline:** ElevenLabs (Alice, `Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`) — per `audio_generation_pipeline.md`
