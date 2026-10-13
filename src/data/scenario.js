// Mock wearable + context data for one runner on one Monday.
// In production this comes from the watch sync, cycle app and weather API.

export const user = {
  name: 'Melly',
  goal: { title: 'First half marathon', date: '15 June', weeksLeft: 4, week: 9, weeks: 13 },
  watch: 'Watch synced 2 min ago',
}

export const readiness = { score: 58, label: 'Go easy today', tone: 'amber' }

export const weather = { temp: 14, condition: 'Cloudy, windy after 16:00', wind: 22 }

export const sessions = {
  hmPace: {
    id: 'hmPace',
    title: 'Half-marathon pace 3×2 km',
    type: 'run',
    intensity: 'High',
    duration: '1:08',
    distance: '11 km',
    blocks: [
      { label: 'Warm-up 20 min', zone: 2, w: 28 },
      { label: '2 km', zone: 4, w: 13 },
      { label: '4′', zone: 1, w: 5 },
      { label: '2 km', zone: 4, w: 13 },
      { label: '4′', zone: 1, w: 5 },
      { label: '2 km', zone: 4, w: 13 },
      { label: 'Cool-down 5′', zone: 2, w: 9 },
    ],
    // Each step leads with how it should FEEL. Pace and heart rate are the fine print.
    steps: [
      { do: 'Warm up · 20 min', feel: 'Easy. You can chat.', detail: '6:40–7:00 /km · 139–147 bpm' },
      { do: '3 × 2 km', feel: 'Hard. Only a few words at a time.', detail: '5:41 /km · ~160 bpm · 4 min easy jog between' },
      { do: 'Cool down · 5 min', feel: 'Easy. Let your breathing settle.', detail: '6:40–7:00 /km' },
    ],
  },
  easy: {
    id: 'easy',
    title: 'Easy run 35 min',
    type: 'run',
    intensity: 'Low',
    duration: '0:35',
    distance: '~5.4 km',
    blocks: [{ label: 'Zone 2 · conversational pace', zone: 2, w: 100 }],
    steps: [
      { do: 'Run · 35 min', feel: 'Easy. You can talk in full sentences.', detail: '6:30–6:50 /km · under 150 bpm' },
      { do: 'If breathing gets heavy', feel: 'Walk 30 seconds, then go again.', detail: 'heart rate above 150 bpm' },
    ],
  },
}

// The week. `adapt` describes what the coach would change and why.
export const week = [
  {
    day: 'Mon', date: 19, label: 'Today',
    items: [
      { id: 'today-run', planned: 'hmPace', adaptTo: 'easy', reason: 'Short night, body still recovering' },
      { id: 'stretch', title: 'Stretching', sub: '10 min · evening', type: 'stretch' },
    ],
  },
  { day: 'Tue', date: 20, label: 'Tomorrow', items: [
    { id: 'yoga', title: 'Yoga', sub: '30 min · release tight hips', type: 'yoga' },
  ] },
  { day: 'Wed', date: 21, items: [
    { id: 'pool', title: 'Pool day', sub: '40 min · easy swim', type: 'swim' },
  ] },
  { day: 'Thu', date: 22, items: [
    { id: 'rest', title: 'Rest', sub: 'Recovery is where you get faster', type: 'rest' },
  ] },
  { day: 'Fri', date: 23, items: [
    { id: 'runwalk', title: 'Run/Walk 28 min', sub: 'Low intensity', type: 'run' },
  ] },
  { day: 'Sat', date: 24, items: [
    { id: 'long', title: 'Endurance 1h20', sub: 'Long run · zone 2', type: 'run', movedIfSwap: { title: 'Half-marathon pace 3×2 km', sub: 'Moved from Monday', type: 'run' } },
  ] },
  { day: 'Sun', date: 25, items: [
    { id: 'sunday', title: 'Rest', sub: 'Free day', type: 'rest', movedIfSwap: { title: 'Endurance 1h20', sub: 'Moved from Saturday', type: 'run' } },
  ] },
]

// The coach's decision journal: every change, with its reason.
export const decisions = [
  { when: 'Today, 07:12', what: 'Suggested: 3×2 km → easy 35 min', why: 'Short night · heart working harder at rest · recovery low' },
  { when: 'Sat 17 May', what: 'Moved long run to the morning', why: 'Rain from 14:00 · 82% chance' },
  { when: 'Thu 15 May', what: 'Added evening stretching', why: 'Cycle day 20 · you logged tight calves' },
  { when: 'Mon 12 May', what: 'Lowered interval pace by 6 s/km', why: 'Your last 3 sessions felt harder to you than the data expected' },
]

// Debrief data for the easy run.
export const splits = [
  { km: 1, pace: 358, hr: 171 },
  { km: 2, pace: 391, hr: 151 },
  { km: 3, pace: 402, hr: 147 },
  { km: 4, pace: 405, hr: 146 },
  { km: 5, pace: 399, hr: 148 },
  { km: 6, pace: 396, hr: 149 },
]
export const targetPace = [390, 410] // 6:30–6:50 /km, in seconds

export const sessionTotals = [
  { label: 'Duration', value: '35:12', means: 'Right on plan' },
  { label: 'Distance', value: '5.42 km', means: 'Like your usual easy run' },
  { label: 'Avg pace', value: '6:30 /km', means: 'Inside your easy range' },
  { label: 'Avg heart rate', value: '151 bpm', means: 'Easy, except km 1' },
  { label: 'Elevation', value: '38 m', means: 'Basically flat' },
  { label: 'Energy', value: '352 kcal', means: 'About one bowl of pasta' },
]

export const guardians = [
  { name: 'Mom', relation: 'Guardian', initial: 'M' },
  { name: 'Thomas', relation: 'Running buddy', initial: 'T' },
]

export const statusOptions = [
  {
    id: 'injured', ack: 'you’re injured', emoji: '🤕', label: 'I’m injured',
    changes: ['Running paused for 5 days', 'Pool + upper-body sessions added', 'Ask me to re-check before you run again'],
    article: 'cross',
  },
  {
    id: 'sick', ack: 'you’re sick', emoji: '🤒', label: 'I’m sick',
    changes: ['All sessions paused until you feel better', 'Gentle walk only if you have no fever', 'Plan resumes with an easy week'],
    article: 'sick',
  },
  {
    id: 'fasting', ack: 'you’re fasting', emoji: '🌙', label: 'I’m fasting',
    changes: ['Runs moved to after iftar or just before', 'Intensity capped at moderate', 'Hydration reminders at sunset'],
    article: 'fasting',
  },
  {
    id: 'travel', ack: 'you’re traveling', emoji: '✈️', label: 'I’m traveling',
    changes: ['Sessions shortened to 30 min max', 'Hotel-friendly strength routine added', 'Times shifted to your new time zone'],
    article: 'travel',
  },
  {
    id: 'lowmood', ack: 'you’re feeling low', emoji: '🌧️', label: 'Feeling low',
    changes: ['No hard sessions this week', 'Short outdoor runs, no targets', 'A check-in from me every evening'],
    article: 'mood',
  },
  {
    id: 'occasion', ack: 'you have a special occasion', emoji: '🎉', label: 'Special occasion',
    changes: ['Hard session moved away from the big day', 'Easy shake-out run the morning after', 'Back on the normal plan within 2 days'],
    article: 'occasion',
  },
]

export const articles = {
  luteal: { title: 'Training in the days before your period', img: 'img/article-2.png', why: 'Because you’re on cycle day 24' },
  shortSleep: { title: 'Running on a short night: what changes', img: 'img/article-1.png', why: 'Because you slept 5h48' },
  breakfast: { title: 'What to eat before an easy run', img: 'img/article-3.png', why: 'Because you run before lunch' },
  fasting: { title: 'How to train during a fasting period', img: 'img/article-4.png', why: 'Because you’re fasting' },
  cross: { title: 'Cross-training while injured', img: 'img/article-1.png', why: 'Because you’re injured' },
  sick: { title: 'When is it safe to run again?', img: 'img/article-3.png', why: 'Because you’re sick' },
  travel: { title: 'Staying on plan while traveling', img: 'img/article-2.png', why: 'Because you’re traveling' },
  occasion: { title: 'Enjoy the big day without losing your week', img: 'img/article-3.png', why: 'Because you have a special occasion' },
  mood: { title: 'Running for your head, not your watch', img: 'img/article-1.png', why: 'Because you’re feeling low' },
}

export const fmtPace = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`
