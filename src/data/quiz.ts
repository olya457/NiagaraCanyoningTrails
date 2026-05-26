import type {QuizAnswer, ResultCategory} from '../types/app';

export type QuizOption = {
  key: QuizAnswer;
  text: string;
  category: ResultCategory;
};

export type QuizQuestion = {
  id: number;
  question: string;
  options: QuizOption[];
};

export type QuizResultGroup = {
  category: ResultCategory;
  title: string;
  primaryTrailIds: string[];
  alternativeTrailIds: string[];
  reason: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What type of canyoning experience sounds best to you?',
    options: [
      {key: 'A', text: 'Calm waterfalls and easy walking routes', category: 'peaceful'},
      {key: 'B', text: 'Scenic places with some active climbing', category: 'balanced'},
      {key: 'C', text: 'Wild rocky routes with stronger water flow', category: 'rugged'},
      {key: 'D', text: 'Intense extreme canyon adventure', category: 'extreme'},
    ],
  },
  {
    id: 2,
    question: 'What scenery do you enjoy the most?',
    options: [
      {key: 'A', text: 'Misty quiet forest waterfalls', category: 'peaceful'},
      {key: 'B', text: 'Reflective rivers and open canyon views', category: 'balanced'},
      {key: 'C', text: 'Dark narrow rocky passages', category: 'rugged'},
      {key: 'D', text: 'Powerful waterfall drops and cliffs', category: 'extreme'},
    ],
  },
  {
    id: 3,
    question: 'How physically active do you want your route to be?',
    options: [
      {key: 'A', text: 'Mostly relaxing exploration', category: 'peaceful'},
      {key: 'B', text: 'Moderate movement with some climbing', category: 'balanced'},
      {key: 'C', text: 'Challenging terrain and elevation', category: 'rugged'},
      {key: 'D', text: 'Very demanding adventure experience', category: 'extreme'},
    ],
  },
  {
    id: 4,
    question: 'Which atmosphere feels most appealing?',
    options: [
      {key: 'A', text: 'Quiet and calming', category: 'peaceful'},
      {key: 'B', text: 'Adventurous but comfortable', category: 'balanced'},
      {key: 'C', text: 'Dramatic and mysterious', category: 'rugged'},
      {key: 'D', text: 'Powerful and adrenaline-filled', category: 'extreme'},
    ],
  },
  {
    id: 5,
    question: 'What would you most likely stop to do during canyoning?',
    options: [
      {key: 'A', text: 'Take peaceful nature photos', category: 'peaceful'},
      {key: 'B', text: 'Explore viewpoints and concealed passages', category: 'balanced'},
      {key: 'C', text: 'Climb rocks and navigate streams', category: 'rugged'},
      {key: 'D', text: 'Push yourself through intense terrain', category: 'extreme'},
    ],
  },
  {
    id: 6,
    question: 'What best describes your canyoning experience level?',
    options: [
      {key: 'A', text: 'Beginner', category: 'peaceful'},
      {key: 'B', text: 'Some outdoor experience', category: 'balanced'},
      {key: 'C', text: 'Confident adventurer', category: 'rugged'},
      {key: 'D', text: 'Experienced canyon traveler', category: 'extreme'},
    ],
  },
];

export const resultGroups: Record<ResultCategory, QuizResultGroup> = {
  peaceful: {
    category: 'peaceful',
    title: 'Calm Beginner Result',
    primaryTrailIds: ['whisper-falls', 'mist-valley'],
    alternativeTrailIds: ['moss-ridge', 'crystal-veil'],
    reason:
      'You prefer calm nature exploration, easy routes, atmospheric waterfalls, photography, and beginner-friendly canyoning.',
  },
  balanced: {
    category: 'balanced',
    title: 'Scenic Balanced Adventure Result',
    primaryTrailIds: ['silver-rapids', 'blue-torrent'],
    alternativeTrailIds: ['granite-hollow', 'raven-drift'],
    reason:
      'You enjoy moderate activity, scenic viewpoints, active route exploration, and balanced adventure without extreme difficulty.',
  },
  rugged: {
    category: 'rugged',
    title: 'Rugged Cinematic Canyon Result',
    primaryTrailIds: ['shadow-gorge', 'falcon-canyon'],
    alternativeTrailIds: ['iron-creek', 'golden-rift'],
    reason:
      'You prefer dramatic shadowed canyons, technical routes, rocky passages, and a real expedition atmosphere.',
  },
  extreme: {
    category: 'extreme',
    title: 'Extreme Adventure Result',
    primaryTrailIds: ['thunder-pass', 'wild-current'],
    alternativeTrailIds: ['iron-creek', 'falcon-canyon'],
    reason:
      'You are looking for maximum difficulty, strong water flow, adrenaline, and physically intense canyoning.',
  },
};

const saferOrder: ResultCategory[] = ['peaceful', 'balanced', 'rugged', 'extreme'];
const harderOrder: ResultCategory[] = ['rugged', 'extreme', 'balanced', 'peaceful'];

export function resolveQuizResult(
  answers: Record<number, ResultCategory | undefined>,
): QuizResultGroup {
  const scores = saferOrder.reduce<Record<ResultCategory, number>>((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as Record<ResultCategory, number>);

  Object.values(answers).forEach(category => {
    if (category) {
      scores[category] += 1;
    }
  });

  const maxScore = Math.max(...Object.values(scores));
  const tied = saferOrder.filter(category => scores[category] === maxScore);

  if (tied.length === 1) {
    return resultGroups[tied[0]];
  }

  const experience = answers[6];
  if (experience && tied.includes(experience)) {
    return resultGroups[experience];
  }

  const activity = answers[3];
  if (activity && tied.includes(activity)) {
    return resultGroups[activity];
  }

  const advancedReady =
    (activity === 'rugged' || activity === 'extreme') &&
    (experience === 'rugged' || experience === 'extreme');
  const order = advancedReady ? harderOrder : saferOrder;
  return resultGroups[order.find(category => tied.includes(category)) ?? 'peaceful'];
}
