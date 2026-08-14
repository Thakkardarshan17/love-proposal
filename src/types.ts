export interface ProposalConfig {
  yourName: string;
  partnerName: string;
  question: string;
  subQuestion: string;
  finalMessage: string;
  signatureText: string;
  musicTitle: string;
  musicArtist: string;
  whatsappNumber?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  iconName?: string;
  badge?: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  image: string; // poster / thumbnail or fallback image
  mediaType?: 'image' | 'video';
  videoUrl?: string; // direct video URL / blob / data url / uploaded video
  videoEmbedUrl?: string; // YouTube or Vimeo embed url
  videoType?: 'direct' | 'youtube' | 'vimeo' | 'upload';
  rotationDeg: number;
  badge?: string;
}

export interface ReasonItem {
  id: string;
  numberStr: string;
  title: string;
  description: string;
  icon: string;
  color?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  type: 'synth' | 'audio';
  theme: string;
}
