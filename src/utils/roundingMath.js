// ──────────────────────────────────────────────────
// Rounding & Estimation Math Utilities — Grade 7
// IEEE-754 safe calculations & compatible number strategies
// ──────────────────────────────────────────────────

/**
 * Round a number to the nearest given whole place value ('ten'|'hundred'|'thousand'|'ten-thousand')
 */
export function roundToPlace(value, place) {
  const factors = {
    ten: 10,
    hundred: 100,
    thousand: 1000,
    'ten-thousand': 10000,
  };
  const factor = factors[place] || 10;
  return Math.round(value / factor) * factor;
}

/**
 * Round a decimal to a given number of decimal places (avoids float drift via scaling)
 */
export function roundToDecimalPlaces(value, places) {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Round to specified place description: 'whole'|'tenth'|'hundredth'|'ten'|'hundred'|'thousand'|'ten-thousand'
 */
export function roundNumber(value, place) {
  switch (place) {
    case 'whole':
      return Math.round(value);
    case 'tenth':
      return roundToDecimalPlaces(value, 1);
    case 'hundredth':
      return roundToDecimalPlaces(value, 2);
    case 'ten':
      return roundToPlace(value, 'ten');
    case 'hundred':
      return roundToPlace(value, 'hundred');
    case 'thousand':
      return roundToPlace(value, 'thousand');
    case 'ten-thousand':
      return roundToPlace(value, 'ten-thousand');
    default:
      return Math.round(value);
  }
}

/**
 * Estimate a sum or difference by rounding both operands first
 */
export function estimateSumOrDifference(a, b, place, operation = 'add') {
  const ra = roundNumber(a, place);
  const rb = roundNumber(b, place);
  return operation === 'add' ? ra + rb : ra - rb;
}

/**
 * Finds a "friendly" nearby number for compatible-number estimation
 */
export function nearestCompatible(value, operation, role = 'first') {
  if (value === 0) return 0;
  const absVal = Math.abs(value);

  if (operation === 'divide' && role === 'second') {
    // Prefer clean divisors: 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000
    const cleanDivisors = [2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
    const best = cleanDivisors.reduce((closest, d) =>
      Math.abs(d - absVal) < Math.abs(closest - absVal) ? d : closest
    , cleanDivisors[0]);
    return value < 0 ? -best : best;
  }

  // General 1-significant-figure rounding
  const magnitude = 10 ** Math.floor(Math.log10(absVal));
  const rounded = Math.round(absVal / magnitude) * magnitude;
  return value < 0 ? -rounded : rounded;
}

/**
 * Estimate a product or quotient using compatible numbers
 */
export function estimateWithCompatibleNumbers(a, b, operation = 'multiply') {
  const ca = nearestCompatible(a, operation, 'first');
  const cb = nearestCompatible(b, operation, 'second');
  return operation === 'multiply' ? ca * cb : Math.round(ca / cb);
}

/**
 * Determines whether a rounded value is an overestimate or underestimate
 */
export function estimateDirection(original, rounded) {
  if (rounded > original) return 'overestimate';
  if (rounded < original) return 'underestimate';
  return 'exact';
}

/**
 * Formats human-readable place-value label
 */
export function formatPlaceLabel(place) {
  const labels = {
    ten: 'nearest ten',
    hundred: 'nearest hundred',
    thousand: 'nearest thousand',
    'ten-thousand': 'nearest ten-thousand',
    tenth: 'nearest tenth',
    hundredth: 'nearest hundredth',
    whole: 'nearest whole number',
  };
  return labels[place] || place;
}

/**
 * Calculate benchmark ticks around a value for number lines
 */
export function getBenchmarkTicks(value, place, tickCount = 5) {
  const step = place === 'tenth' ? 0.1 : place === 'hundredth' ? 0.01 : place === 'hundred' ? 100 : place === 'thousand' ? 1000 : 10;
  const base = Math.floor(value / step) * step;
  const start = base - Math.floor((tickCount - 1) / 2) * step;
  const ticks = [];
  for (let i = 0; i < tickCount; i++) {
    const val = Number((start + i * step).toFixed(place === 'hundredth' ? 2 : place === 'tenth' ? 1 : 0));
    ticks.push(val);
  }
  return ticks;
}
