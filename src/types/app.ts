import type {ImageSourcePropType} from 'react-native';

export type TrailDifficulty = 2 | 3 | 4 | 5;

export type ResultCategory = 'peaceful' | 'balanced' | 'rugged' | 'extreme';

export type Trail = {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  difficulty: TrailDifficulty;
  category: ResultCategory;
  image: ImageSourcePropType;
  summary: string;
  description: string;
  highlights: string[];
};

export type TabKey =
  | 'locations'
  | 'map'
  | 'saved'
  | 'gallery'
  | 'quiz'
  | 'safety';

export type QuizAnswer = 'A' | 'B' | 'C' | 'D';

export type GalleryEntry = {
  id: string;
  name: string;
  location: string;
  date: string;
  imageTrailId: string;
  imageUri?: string;
};
