// How WACH translates a health metric. Every metric follows the same pattern:
//   plain name → where you are vs YOUR normal → what it means → what to do.
// The technical name is kept, but small, for runners who want it.

export const metrics = {
  sleep: {
    id: 'sleep',
    name: 'Sleep',
    tech: 'Total sleep time · from your watch',
    unit: 'h',
    today: 5.8,
    display: '5h48',
    normal: [6.8, 7.8],
    history: [7.2, 7.5, 6.9, 7.8, 7.1, 7.4, 7.0, 7.6, 7.3, 6.8, 7.2, 7.5, 6.9, 5.8],
    verdict: 'Below your normal',
    effect: 'down',
    what: 'Sleep is when your muscles repair and your body adapts to training. Less sleep means less repair.',
    means: 'You slept about 1.5 hours less than usual. Your body has had less time to recover from Saturday’s long run.',
    todo: 'Keep today easy and aim for bed before 23:00 tonight.',
  },
  rhr: {
    id: 'rhr',
    name: 'Resting heart rate',
    tech: 'Resting HR · beats per minute, measured overnight',
    unit: 'bpm',
    today: 61,
    display: '61 bpm',
    normal: [52, 57],
    history: [54, 55, 53, 54, 56, 54, 53, 55, 54, 55, 56, 57, 58, 61],
    verdict: 'Higher than your normal',
    effect: 'down',
    what: 'How fast your heart beats when you are fully at rest. When your body is tired, stressed or getting sick, your heart works harder even at rest.',
    means: 'Your heart is beating 7 times more per minute than usual. That is a sign your body is still busy recovering.',
    todo: 'Skip hard efforts today. If it stays high for 3+ days, or you feel ill, rest completely.',
  },
  hrv: {
    id: 'hrv',
    name: 'Recovery',
    tech: 'Heart rate variability (HRV) · ms',
    unit: 'ms',
    today: 38,
    display: '38 ms',
    normal: [46, 58],
    history: [52, 55, 49, 54, 51, 53, 56, 50, 48, 47, 45, 43, 41, 38],
    verdict: 'Lower than your normal',
    effect: 'down',
    what: 'The tiny variation in time between heartbeats. A rested body varies more (higher number). A tired body beats like a metronome (lower number).',
    means: 'Your recovery has been dropping for 5 days in a row. Today is the lowest in 9 days. It is common in the days before your period.',
    todo: 'No intervals until it climbs back into your normal range. I will check every morning.',
  },
  cycle: {
    id: 'cycle',
    name: 'Cycle',
    tech: 'Cycle day 24 of 28 · late luteal phase',
    unit: '',
    today: 24,
    display: 'Day 24',
    normal: null,
    history: null,
    verdict: 'Low-energy phase',
    effect: 'neutral',
    what: 'Hormones change across your cycle and affect your body temperature, heart rate and energy.',
    means: 'In the days before your period, heart rate is often a little higher at the same pace. That is your hormones, not lost fitness.',
    todo: 'Judge today’s run by feel, not pace. Extra stretching helps with tension.',
  },
  load: {
    id: 'load',
    name: 'Training load',
    tech: 'Acute:chronic workload ratio 1.05 · 7-day load 602',
    unit: '',
    today: 1.05,
    display: 'Just right',
    normal: [0.8, 1.3],
    history: [0.92, 0.95, 0.98, 1.0, 1.02, 0.99, 1.01, 1.04, 1.06, 1.03, 1.05, 1.08, 1.07, 1.05],
    verdict: 'In your sweet spot',
    effect: 'up',
    what: 'How much you trained this week compared with what your body is used to over the last 4 weeks.',
    means: 'You are training about as much as your body can handle. That is the zone where you improve without getting injured.',
    todo: 'Nothing to change. Keep the week as planned.',
  },
}

// Where today sits inside a range, 0–100%, for the little "your normal" bars.
export function position(m) {
  const vals = [...m.history, ...m.normal]
  const lo = Math.min(...vals), hi = Math.max(...vals)
  const pad = (hi - lo) * 0.15
  const pct = (v) => ((v - (lo - pad)) / (hi - lo + 2 * pad)) * 100
  return { today: pct(m.today), from: pct(m.normal[0]), to: pct(m.normal[1]) }
}

// Heart-rate zones, translated into how they feel.
export const zoneWords = {
  1: 'Very easy',
  2: 'Easy · you can chat',
  3: 'Steady · short sentences',
  4: 'Hard · a few words',
  5: 'All-out',
}
