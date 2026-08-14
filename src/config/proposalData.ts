import { ProposalConfig, TimelineEvent, MemoryItem, ReasonItem, MusicTrack } from '../types';

export const initialProposalConfig: ProposalConfig = {
  yourName: "DARSHAN",
  partnerName: "MY LOVE",
  question: "Will You Be Mine? ❤️",
  subQuestion: "I don't know what the future holds... But I know who I want beside me.",
  finalMessage: "From This Moment... Every Smile, Every Dream, Every Adventure... I Want To Share It With You. Forever & Always ❤️",
  signatureText: "With all my love & whole heart,",
  musicTitle: "Our Song",
  musicArtist: "Always You",
  whatsappNumber: "+91 7201030048",
};

export const initialTimelineEvents: TimelineEvent[] = [
  {
    id: 'timeline-1',
    title: 'The Day We Met',
    subtitle: 'The spark that started our universe',
    date: 'That Magical Day',
    description: 'A brief glance that felt like coming home. The moment our eyes met, time stood still and I knew something extraordinary had just begun.',
    iconName: 'Sparkles',
    badge: 'Chapter 01'
  },
  {
    id: 'timeline-2',
    title: 'The First Conversation',
    subtitle: 'Hours melted into minutes',
    date: 'Unforgettable Words',
    description: 'We talked until 3 AM about everything and nothing. Every laugh we shared made me realize how effortlessly our souls connected.',
    iconName: 'MessageCircleHeart',
    badge: 'Chapter 02'
  },
  {
    id: 'timeline-3',
    title: 'The First Smile',
    subtitle: 'My favorite view in the world',
    date: 'Pure Sunshine',
    description: 'When you looked at me and smiled with your whole heart, my world turned to color. That smile remains my greatest weakness and strength.',
    iconName: 'Smile',
    badge: 'Chapter 03'
  },
  {
    id: 'timeline-4',
    title: 'The Beautiful Dreams',
    subtitle: 'Adventures, quiet coffees & warm hugs',
    date: 'Endless Journeys',
    description: 'From late-night drives to quiet rainy evenings holding hands, every second spent with you is a treasure I cherish forever.',
    iconName: 'Camera',
    badge: 'Chapter 04'
  },
  {
    id: 'timeline-5',
    title: 'Today & Beyond',
    subtitle: 'The greatest question of my life',
    date: 'Right Here, Right Now',
    description: 'Standing before you today, ready to promise you all my tomorrows, every heartbeat, and an eternity of unconditional love.',
    iconName: 'HeartHandshake',
    badge: 'Forever'
  }
];

export const initialMemories: MemoryItem[] = [
  {
    id: 'mem-1',
    title: 'That Golden Sunset',
    description: 'Watching the sky turn into shades of gold and pink, holding your hand and wishing that sunset would never end.',
    date: 'Golden Hour Dreams',
    location: 'By the peaceful shore',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
    rotationDeg: -4,
    badge: 'Pure Magic'
  },
  {
    id: 'mem-2',
    title: 'Our Cozy Coffee Dates',
    description: 'Steaming cups, silly jokes, and laughing until our stomachs hurt. The world outside disappeared.',
    date: 'Autumn Afternoon',
    location: 'Our favorite corner café',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
    rotationDeg: 3.5,
    badge: 'Unconditional'
  },
  {
    id: 'mem-3',
    title: 'Dancing Under The Rain',
    description: 'Getting soaked, catching raindrops on our eyelashes, and spinning you around like nobody else existed.',
    date: 'Rainy Night In The City',
    location: 'Under streetlamps glow',
    image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop',
    rotationDeg: -2.5,
    badge: 'Forever & Always'
  },
  {
    id: 'mem-4',
    title: 'Stargazing Together',
    description: 'Lying on a blanket, counting shooting stars, but I spent more time admiring you than the sky.',
    date: 'Midnight Starlight',
    location: 'Hilltop Viewpoint',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    rotationDeg: 4.2,
    badge: 'Dream Come True'
  },
  {
    id: 'mem-5',
    title: 'Every Little Hug',
    description: 'How your head fits perfectly on my shoulder and the way you breathe a sigh of comfort when I hold you close.',
    date: 'Every Single Day',
    location: 'Wherever you are is home',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop',
    rotationDeg: -3.8,
    badge: 'My Safe Haven'
  },
  {
    id: 'mem-6',
    title: 'Our Spontaneous Roadtrips',
    description: 'Singing off-key to romantic songs with the windows down, eating snacks, and enjoying the journey together.',
    date: 'Weekend Getaway',
    location: 'Open Highway & Music',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop',
    rotationDeg: 2.8,
    badge: 'Our Journey'
  }
];

export const initialReasons: ReasonItem[] = [
  {
    id: 'reason-1',
    numberStr: '01',
    title: 'Your Radiant Smile ❤️',
    description: 'The way your eyes light up and a gentle dimple appears. It can instantly brighten my darkest days.',
    icon: 'Sparkles',
    color: 'from-rose-500/20 to-pink-500/10'
  },
  {
    id: 'reason-2',
    numberStr: '02',
    title: 'Your Kind & Gentle Heart ❤️',
    description: 'The selfless compassion you show everyone around you. You love purely, deeply, and unconditionally.',
    icon: 'Heart',
    color: 'from-pink-500/20 to-rose-400/10'
  },
  {
    id: 'reason-3',
    numberStr: '03',
    title: 'The Way You Understand Me ❤️',
    description: 'Even without speaking a single word, you read my thoughts. With you, I am completely myself.',
    icon: 'Eye',
    color: 'from-amber-500/20 to-rose-500/10'
  },
  {
    id: 'reason-4',
    numberStr: '04',
    title: 'The Way You Make Me Happy ❤️',
    description: 'Your silly laughter, sweet messages, and thoughtful surprises bring endless joy into my everyday life.',
    icon: 'Sun',
    color: 'from-rose-400/20 to-amber-400/10'
  },
  {
    id: 'reason-5',
    numberStr: '05',
    title: "You're My Peace & Home ❤️",
    description: 'In a noisy and chaotic world, being wrapped in your arms is the only place my soul feels truly at home.',
    icon: 'ShieldCheck',
    color: 'from-pink-600/20 to-rose-500/10'
  }
];

export const availableMusicTracks: MusicTrack[] = [
  {
    id: 'track-1',
    title: 'Our Song (Cinematic Piano & Harp)',
    artist: 'Always You — Romantic Symphony',
    type: 'synth',
    theme: 'Dreamy & Loving'
  },
  {
    id: 'track-2',
    title: 'Celestial Waltz Of Love',
    artist: 'Starlight Romance & Strings',
    type: 'synth',
    theme: 'Cinematic Ballroom'
  },
  {
    id: 'track-3',
    title: 'Eternity With You',
    artist: 'Acoustic Warmth & Soft Bells',
    type: 'synth',
    theme: 'Warm & Intimate'
  }
];
