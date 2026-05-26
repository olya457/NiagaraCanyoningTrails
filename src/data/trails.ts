import {images} from '../assets';
import type {Trail} from '../types/app';

export const trails: Trail[] = [
  {
    id: 'whisper-falls',
    name: 'Whisper Falls',
    coordinates: {latitude: 43.0896, longitude: -79.0849},
    difficulty: 2,
    category: 'peaceful',
    image: images.trails.whisperFalls,
    summary:
      'A calm beginner route with shallow water, smooth rock paths, and soft forest mist.',
    description:
      'Whisper Falls is a calm canyoning location concealed near smaller forest waterfalls in the Niagara region. The route includes shallow flowing water, smooth rock pathways, and light elevation changes that make it ideal for beginners exploring canyon routes for the first time. The trail contains small water crossings, natural pools, quiet wet stone walls, and dense green vegetation.',
    highlights: ['Beginner friendly', 'Natural pools', 'Misty waterfall photos'],
  },
  {
    id: 'granite-hollow',
    name: 'Granite Hollow',
    coordinates: {latitude: 43.1024, longitude: -79.1183},
    difficulty: 3,
    category: 'balanced',
    image: images.trails.graniteHollow,
    summary:
      'Narrow rocky canyon passages with flowing river sections and layered cliffs.',
    description:
      'Granite Hollow is known for narrow rocky canyon passages and flowing river sections that cut through darker stone formations. The route mixes wet terrain with uneven climbing surfaces, creating an adventurous canyoning experience without becoming overly technical. Shaded walls stay cool in summer, and sunset light creates strong contrast across the granite.',
    highlights: ['Layered cliffs', 'River passages', 'Moderate climbing'],
  },
  {
    id: 'emerald-cascade',
    name: 'Emerald Cascade',
    coordinates: {latitude: 43.0745, longitude: -79.0678},
    difficulty: 2,
    category: 'peaceful',
    image: images.trails.emeraldCascade,
    summary:
      'Aqua water, curved canyon rocks, and relaxed waterfall viewpoints.',
    description:
      'Emerald Cascade features bright aqua water flowing through smooth curved canyon rocks inside a peaceful forest corridor. Soft elevation changes and multiple scenic waterfall viewpoints keep the route relaxed and open. Lower pools reflect green mineral tones and surrounding vegetation, especially during foggy mornings.',
    highlights: ['Aqua water', 'Gentle terrain', 'Morning fog'],
  },
  {
    id: 'shadow-gorge',
    name: 'Shadow Gorge',
    coordinates: {latitude: 43.1217, longitude: -79.1452},
    difficulty: 4,
    category: 'rugged',
    image: images.trails.shadowGorge,
    summary:
      'A darker canyon route with steep formations, narrow passages, and echoing waterfalls.',
    description:
      'Shadow Gorge is a deeper canyon route with steep rock formations and narrow passages between flowing waterfalls. Large stone walls block direct sunlight, creating a dramatic atmosphere with moving water reflections. Several sections require steady footing, wet rock movement, and moderate canyoning experience.',
    highlights: ['Shadowed walls', 'Technical footing', 'Waterfall echoes'],
  },
  {
    id: 'silver-rapids',
    name: 'Silver Rapids',
    coordinates: {latitude: 43.0968, longitude: -79.1325},
    difficulty: 3,
    category: 'balanced',
    image: images.trails.silverRapids,
    summary:
      'Fast-flowing waterfall streams, shallow canyon channels, and optional climbs.',
    description:
      'Silver Rapids combines shallow river canyon routes with multiple fast-flowing waterfall streams cutting through smooth stone channels. Wider open spaces alternate with narrow sections, and daylight reflections create silver highlights across wet rock. Optional climbing areas add activity without pushing the trail into expert terrain.',
    highlights: ['Silver reflections', 'Optional climbs', 'Balanced adventure'],
  },
  {
    id: 'falcon-canyon',
    name: 'Falcon Canyon',
    coordinates: {latitude: 43.0814, longitude: -79.1019},
    difficulty: 4,
    category: 'rugged',
    image: images.trails.falconCanyon,
    summary:
      'Rugged ledges, elevated viewpoints, and a wild expedition feeling.',
    description:
      'Falcon Canyon is a rugged waterfall route with sharp rock ledges, elevated viewpoints, and stronger water currents during wetter seasons. Panoramic openings look over river valleys before the path narrows into rocky water corridors. Stable footwear and moderate canyoning confidence are recommended.',
    highlights: ['Elevated views', 'Wild atmosphere', 'Rugged ledges'],
  },
  {
    id: 'crystal-veil',
    name: 'Crystal Veil',
    coordinates: {latitude: 43.0672, longitude: -79.0927},
    difficulty: 2,
    category: 'peaceful',
    image: images.trails.crystalVeil,
    summary:
      'Thin waterfall streams over layered rock with bright reflective surfaces.',
    description:
      'Crystal Veil is a scenic canyoning route where thin waterfall streams flow over layered rock surfaces. Gentle walking sections, natural pools, and shallow streams make the route comfortable for relaxed exploration. In sunny weather, reflected light creates shimmering patterns across the canyon walls.',
    highlights: ['Layered rock', 'Shallow streams', 'Easy walking'],
  },
  {
    id: 'iron-creek',
    name: 'Iron Creek',
    coordinates: {latitude: 43.1151, longitude: -79.1594},
    difficulty: 4,
    category: 'rugged',
    image: images.trails.ironCreek,
    summary:
      'Dark stone, fast-moving channels, and demanding river crossings.',
    description:
      'Iron Creek contains rugged canyon terrain with darker stone formations and fast-moving water channels. Steep rocky surfaces and narrow river crossings require careful navigation in wet conditions. After rainfall, stronger flow and slick rock textures make the route more intense.',
    highlights: ['Dark formations', 'Fast water', 'Demanding terrain'],
  },
  {
    id: 'moss-ridge',
    name: 'Moss Ridge',
    coordinates: {latitude: 43.0881, longitude: -79.0736},
    difficulty: 2,
    category: 'peaceful',
    image: images.trails.mossRidge,
    summary:
      'Soft green canyon corridors, mossy stone, and slower water movement.',
    description:
      'Moss Ridge features soft green canyon environments where waterfalls flow through moss-covered stone corridors. Quiet walking sections, shaded greenery, and shallow reflective pools make the route accessible for most visitors. The area becomes especially atmospheric after light rain.',
    highlights: ['Mossy corridors', 'Reflective pools', 'Easy terrain'],
  },
  {
    id: 'thunder-pass',
    name: 'Thunder Pass',
    coordinates: {latitude: 43.1278, longitude: -79.1661},
    difficulty: 5,
    category: 'extreme',
    image: images.trails.thunderPass,
    summary:
      'A steep expert route with aggressive waterfall channels and loud echoes.',
    description:
      'Thunder Pass is one of the most challenging canyoning routes in the Niagara region, featuring steep descents and aggressive waterfall channels. Strong water movement and uneven terrain create a physically demanding route suited for experienced travelers only. Massive waterfall sections generate loud echoes through narrow rock corridors.',
    highlights: ['Expert route', 'Steep descents', 'Powerful waterfalls'],
  },
  {
    id: 'cedar-basin',
    name: 'Cedar Basin',
    coordinates: {latitude: 43.0795, longitude: -79.1126},
    difficulty: 2,
    category: 'peaceful',
    image: images.trails.cedarBasin,
    summary:
      'Small canyon waterfalls, cedar openings, and smooth river stone.',
    description:
      'Cedar Basin combines small canyon waterfalls with wider forest openings surrounded by cedar trees and smooth river stone formations. Relaxed walking terrain and occasional shallow crossings create a peaceful route for longer casual walks. Lower basin pools reflect surrounding greenery.',
    highlights: ['Cedar forest', 'Lower pools', 'Relaxed walk'],
  },
  {
    id: 'raven-drift',
    name: 'Raven Drift',
    coordinates: {latitude: 43.1113, longitude: -79.1407},
    difficulty: 3,
    category: 'balanced',
    image: images.trails.ravenDrift,
    summary:
      'Curved river channels and layered stone waterfalls between rocky cliffs.',
    description:
      'Raven Drift is a medium-difficulty canyon route with curved river channels and layered stone waterfalls concealed between rocky cliffs. Terrain alternates between open river spaces and tighter corridors, while moving water creates reflective textures throughout the route.',
    highlights: ['Curved channels', 'Layered falls', 'Cinematic transitions'],
  },
  {
    id: 'blue-torrent',
    name: 'Blue Torrent',
    coordinates: {latitude: 43.0944, longitude: -79.1253},
    difficulty: 3,
    category: 'balanced',
    image: images.trails.blueTorrent,
    summary:
      'Clear fast streams, smooth curves, and blue-toned rocky pools.',
    description:
      'Blue Torrent features fast-moving clear water streams flowing through smooth canyon curves and shallow rocky pools. The route feels active and energetic while staying accessible for travelers with moderate outdoor experience. Cooler mornings bring mist across the lower pools and waterfall drops.',
    highlights: ['Clear water', 'Blue pools', 'Moderate challenge'],
  },
  {
    id: 'golden-rift',
    name: 'Golden Rift',
    coordinates: {latitude: 43.0697, longitude: -79.0812},
    difficulty: 4,
    category: 'rugged',
    image: images.trails.goldenRift,
    summary:
      'Warm late-day reflections across wet stone, narrow cliffs, and technical footing.',
    description:
      'Golden Rift is a rocky canyon route known for warm golden reflections appearing across wet stone during late afternoon sunlight. Narrow cliff passages, uneven rock formations, and flowing waterfall sections create a more technical canyoning atmosphere. Moderate canyoning experience is recommended.',
    highlights: ['Golden light', 'Narrow cliffs', 'Technical sections'],
  },
  {
    id: 'wild-current',
    name: 'Wild Current',
    coordinates: {latitude: 43.1185, longitude: -79.1714},
    difficulty: 5,
    category: 'extreme',
    image: images.trails.wildCurrent,
    summary:
      'Strong currents, steep rocky descents, and intense narrow water corridors.',
    description:
      'Wild Current is an advanced canyon route with strong water movement, steep rocky descents, and narrow river corridors. Powerful waterfall sections dominate several parts of the route. After rainfall, stronger currents and reduced visibility on wet stone surfaces make the route especially challenging.',
    highlights: ['Advanced route', 'Strong currents', 'Steep descents'],
  },
  {
    id: 'mist-valley',
    name: 'Mist Valley',
    coordinates: {latitude: 43.0852, longitude: -79.0974},
    difficulty: 2,
    category: 'peaceful',
    image: images.trails.mistValley,
    summary:
      'Thin waterfalls, open stone valleys, and calm beginner-friendly paths.',
    description:
      'Mist Valley is a softer scenic canyoning route where thin waterfalls flow through open stone valleys surrounded by forest vegetation. Smooth pathways make the route accessible for relaxed exploration, slow walks, photography, and quiet outdoor experiences.',
    highlights: ['Morning mist', 'Smooth paths', 'Beginner friendly'],
  },
];

export const trailById = trails.reduce<Record<string, Trail>>((acc, trail) => {
  acc[trail.id] = trail;
  return acc;
}, {});

export function difficultyStars(difficulty: number): string {
  return `${'★'.repeat(difficulty)}${'☆'.repeat(5 - difficulty)}`;
}
