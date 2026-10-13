// The three AI coaches. Same data, same decisions — different voice.
// Every user-facing coach sentence in the app comes from here, so switching
// coach visibly changes the tone of the whole product.

export const coaches = {
  clara: {
    id: 'clara',
    face: 'img/coaches/clara.jpg',
    name: 'Clara',
    title: 'The calm strategist',
    motto: 'Slow is smooth. Smooth is fast.',
    intro: (name) => `Hi ${name}, I’m Clara. Every morning I’ll read your watch and tell you what it means, calmly, with the numbers to back it up.`,
    style: 'Explains the why with numbers and charts.',
    hue: ['#0A5E8A', '#5CC8F0'],
    format: 'charts',
    lines: {
      greeting: (name) => `Morning, ${name}.`,
      brief: () =>
        'You slept 1.5 hours less than usual, and your heart is beating faster than normal even at rest. Your body is still recovering. Intervals today would tire you more than they help, so let’s run easy for 35 minutes.',
      swapAccepted: () => 'Done. 3×2 km moves to Saturday, when your recovery should be back.',
      swapKept: () => 'Your call. Keep the first rep conservative and I will watch your heart rate.',
      outfit: () => 'Wind picks up to 22 km/h after 16:00. Take the wind breaker.',
      habit: () => 'Late snacks 3 nights this week. Dinner before 20:00 helps tonight’s sleep.',
      cycle: () => 'Day 24: the days before your period. Your heart may beat a little faster at the same pace. That is your hormones, not lost fitness.',
      live: [
        'Your heart is working a bit too hard. Slow down slightly until you could chat again.',
        'Good. This is your easy pace. Hold it here.',
        'Your steps are getting long and heavy. Take shorter, quicker steps.',
      ],
      debriefHeadline: 'Solid session, but your first kilometre was too fast.',
      debriefPace: 'You ran the first km at 5:58, much faster than your easy pace of 6:30–6:50. Your heart rate shot up before your body was warm.',
      debriefSleep: 'After a short night your heart reacts faster, so that spike was expected. It is exactly why today stayed easy.',
      debriefNotes: (s) => `You noted ${s}. With a short night that usually points to fatigue and hydration. Drink 500 ml in the next hour. If it persists, check with a doctor.`,
      debriefNext: 'Tomorrow stays gentle: yoga, 30 min. Intervals are on Saturday.',
      statusAck: (ack) => `Noted: ${ack}. Here is how I would adjust the next 7 days.`,
    },
  },
  blaze: {
    id: 'blaze',
    face: 'img/coaches/blaze.jpg',
    name: 'Blaze',
    title: 'The hype partner',
    motto: 'Show up. I’ll handle the rest.',
    intro: (name) => `Hey ${name}! I’m Blaze ⚡ I’ll keep it short, keep you moving, and celebrate every run with you 🎉`,
    style: 'Short, upbeat, emoji-first breakdowns.',
    hue: ['#7BC41A', '#B3F83B'],
    format: 'emoji',
    lines: {
      greeting: (name) => `Let’s go, ${name}! ⚡`,
      brief: () =>
        'Short night 😴 and your heart’s working harder than usual. Today we cruise: easy 35 min. We crush the intervals on Saturday 💪',
      swapAccepted: () => 'Locked in 🔒 Saturday = interval day.',
      swapKept: () => 'Respect 🔥 Start slow, I’ve got your back.',
      outfit: () => 'Windy after 16:00 🌬️ Wind breaker on!',
      habit: () => 'Chips o’clock is calling 🍟 Let’s skip it tonight.',
      cycle: () => 'Day 24 🌙 Heart rate runs a bit higher now. Totally normal, you’re not slower!',
      live: [
        'Whoa, easy tiger 🐯 Slow down a touch.',
        'That’s the rhythm 🎵 Keep it right there.',
        'Quick feet! 👟 Shorter steps.',
      ],
      debriefHeadline: 'Nice work! 🎉 Just started a bit hot.',
      debriefPace: 'Km 1 = rocket 🚀 (5:58). The plan was 6:30–6:50.',
      debriefSleep: 'Short night + fast start = heart rate spike 📈 That’s why we went easy.',
      debriefNotes: (s) => `You felt ${s} 😕 Water time 💧 500 ml in the next hour. Still bad later? See a doctor.`,
      debriefNext: 'Tomorrow: chill yoga 🧘 Saturday: interval party 🥳',
      statusAck: (ack) => `Got it, ${ack} 🫶 Here’s the new game plan 👇`,
    },
  },
  theo: {
    id: 'theo',
    face: 'img/coaches/theo.jpg',
    name: 'Theo',
    title: 'The caring mentor',
    motto: 'Listen to your body first.',
    intro: (name) => `Hello ${name}, I’m Theo. I’ll help you listen to your body first, and train around how you really feel.`,
    style: 'Gentle, body-first, focused on how you feel.',
    hue: ['#E8803A', '#FFC48A'],
    format: 'gentle',
    lines: {
      greeting: (name) => `Good morning, ${name}.`,
      brief: () =>
        'Your body is asking for a softer day. Your sleep was short and your heart is working harder at rest. Let’s run easy and enjoy it. The hard session can wait for Saturday.',
      swapAccepted: () => 'Thank you for listening to your body. Saturday it is.',
      swapKept: () => 'Okay. Promise me you will stop if anything feels off.',
      outfit: () => 'It gets windy after 16:00. A wind breaker will keep you comfortable.',
      habit: () => 'Be kind to tomorrow-you: an earlier dinner helps you sleep.',
      cycle: () => 'Day 24. Energy often dips now, and that is okay. Stretching tonight will help with tension.',
      live: [
        'Breathe out longer than you breathe in. Let the pace soften.',
        'Lovely. This is the pace your body likes today.',
        'Relax your shoulders. Light, quick steps.',
      ],
      debriefHeadline: 'You showed up on a hard day. That counts.',
      debriefPace: 'The first kilometre was a bit eager (5:58). Next time, let the first 10 minutes feel almost too easy.',
      debriefSleep: 'After a short night your heart needs more time to settle. Today was the right choice.',
      debriefNotes: (s) => `You mentioned ${s}. Sip some water, rest, and eat something light. If it doesn’t ease, please talk to a doctor.`,
      debriefNext: 'Tomorrow: slow yoga to loosen up. We will try the intervals on Saturday.',
      statusAck: (ack) => `Thank you for telling me ${ack}. Here is how I would make room for that.`,
    },
  },
}

export const coachList = Object.values(coaches)
