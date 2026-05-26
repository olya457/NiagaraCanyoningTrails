import {Share} from 'react-native';
import type {Trail} from '../types/app';

export async function shareTrail(trail: Trail): Promise<void> {
  await Share.share({
    title: trail.name,
    message: `${trail.name}\n${trail.summary}\nCoordinates: ${trail.coordinates.latitude.toFixed(4)}, ${trail.coordinates.longitude.toFixed(4)}`,
  });
}

export async function shareText(title: string, message: string): Promise<void> {
  await Share.share({title, message});
}
