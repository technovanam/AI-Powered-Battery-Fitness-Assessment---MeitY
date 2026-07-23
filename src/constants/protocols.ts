import { TestProtocolInfo, TestId } from '../types/assessment';

export const TEST_PROTOCOLS: Record<TestId, TestProtocolInfo> = {
  height: {
    id: 'height',
    name: 'Height Assessment',
    nameHindi: 'ऊंचाई मापन',
    category: 'Morphology',
    isAiSupported: true,
    unit: 'cm',
    description: 'Measures vertical height standing against wall with A4 calibration marker in frame.',
    instructions: [
      'Place standard A4 Calibration Marker on wall at knee/waist level.',
      'Athlete stands straight against wall, heels together, posture upright.',
      'Ensure full body and marker are visible in the frame.',
      'Hold position for 3 seconds while AI locks calibration and detects head-top.'
    ],
    minDurationSeconds: 3,
    maxDurationSeconds: 10,
    targetRange: { min: 100, max: 220 }
  },
  vertical_jump: {
    id: 'vertical_jump',
    name: 'Vertical Jump',
    nameHindi: 'वर्टिकल जंप',
    category: 'Lower Body Explosive Power',
    isAiSupported: true,
    unit: 'cm',
    description: 'Measures jump height based on flight time physics (h = g·t²/8).',
    instructions: [
      'Position phone 3-4 meters away, capturing full standing height and space above.',
      'Athlete stands upright, crouches, and jumps maximum vertical height.',
      'AI tracks takeoff and landing frames to calculate exact air-time height.'
    ],
    minDurationSeconds: 5,
    maxDurationSeconds: 15,
    targetRange: { min: 10, max: 100 }
  },
  broad_jump: {
    id: 'broad_jump',
    name: 'Standing Broad Jump',
    nameHindi: 'स्टैंडिंग ब्रॉड जंप',
    category: 'Explosive Leg Power',
    isAiSupported: true,
    unit: 'cm',
    description: 'Measures horizontal jump distance using ground plane homography.',
    instructions: [
      'Place A4 Calibration Marker on takeoff line.',
      'Camera positioned side-on covering takeoff line and landing area.',
      'Athlete jumps forward off both feet; AI measures distance to nearest heel on landing.'
    ],
    minDurationSeconds: 5,
    maxDurationSeconds: 15,
    targetRange: { min: 50, max: 350 }
  },
  sit_ups: {
    id: 'sit_ups',
    name: 'Abdominal Curl / Sit-Ups',
    nameHindi: 'सिट-अप्स (पेट की ताकत)',
    category: 'Core Strength & Endurance',
    isAiSupported: true,
    unit: 'reps',
    description: 'Counts valid sit-up repetitions within timer (30s U-12 / 45s 12+).',
    instructions: [
      'Position camera 2-3m side-view capturing full body lying down.',
      'Athlete starts flat on back (DOWN >150°), curls up until elbows pass knees (UP <60°).',
      'AI counts valid reps and filters unclasped hands or incomplete curls.'
    ],
    minDurationSeconds: 30,
    maxDurationSeconds: 45,
    targetRange: { min: 0, max: 60 }
  },
  weight: {
    id: 'weight',
    name: 'Body Weight',
    nameHindi: 'शरीर का वजन',
    category: 'Morphology',
    isAiSupported: false,
    unit: 'kg',
    description: 'Measures body mass using standard digital scale.',
    instructions: [
      'Athlete steps onto digital scale wearing minimal footwear.',
      'Enter weight value manually or snap photo of scale display for OCR auto-fill.'
    ],
    targetRange: { min: 15, max: 150 }
  },
  sit_and_reach: {
    id: 'sit_and_reach',
    name: 'Sit & Reach Flexibility',
    nameHindi: 'सिट एंड रीच लचीलापन',
    category: 'Flexibility & Hamstring Mobility',
    isAiSupported: false,
    unit: 'cm',
    description: 'Measures flexibility of lower back and hamstring muscles.',
    instructions: [
      'Athlete sits with legs fully extended against sit-and-reach box.',
      'Reaches forward smoothly as far as possible without bending knees.',
      'Enter maximum distance reached in cm.'
    ],
    targetRange: { min: -10, max: 50 }
  },
  medicine_ball: {
    id: 'medicine_ball',
    name: 'Medicine Ball Put / Throw',
    nameHindi: 'मेडिसिन बॉल थ्रो',
    category: 'Upper Body Explosive Power',
    isAiSupported: false,
    unit: 'm',
    description: 'Measures upper body pushing power with 1kg/2kg medicine ball.',
    instructions: [
      'Athlete holds ball at chest, pushes explosively forward from seated/standing position.',
      'Measure distance from throw line to point of impact with tape measure.',
      'Enter distance in meters.'
    ],
    targetRange: { min: 1, max: 20 }
  },
  sprint_30m: {
    id: 'sprint_30m',
    name: '30-Meter Standing Sprint',
    nameHindi: '30 मीटर स्प्रिंट',
    category: 'Acceleration & Speed',
    isAiSupported: false,
    unit: 's',
    description: 'Timed 30m sprint from standing start position.',
    instructions: [
      'Athlete starts behind start line in standing position.',
      'On signal, sprints maximum speed across 30m finish line.',
      'Enter timing from official stopwatch in seconds.'
    ],
    targetRange: { min: 3.5, max: 12.0 }
  },
  shuttle_run: {
    id: 'shuttle_run',
    name: '10x5m Shuttle Run',
    nameHindi: '10x5m शटल रन',
    category: 'Agility & Change of Direction',
    isAiSupported: false,
    unit: 's',
    description: '10 repetitions of 5-meter distance sprint turning back.',
    instructions: [
      'Set two blocks 5 meters apart.',
      'Athlete sprints back and forth 10 times moving blocks across lines.',
      'Enter total elapsed time in seconds.'
    ],
    targetRange: { min: 14.0, max: 40.0 }
  },
  endurance_run: {
    id: 'endurance_run',
    name: '600m / 1 Mile Endurance Run',
    nameHindi: '600m / 1 मील सहनशक्ति दौड़',
    category: 'Aerobic Endurance',
    isAiSupported: false,
    unit: 'min',
    description: 'Distance endurance run/walk test.',
    instructions: [
      'Athletes complete 600m (U-12) or 1-mile (12+) course at maximal pace.',
      'Record completion time upon crossing finish line.',
      'Enter time in minutes and seconds.'
    ],
    targetRange: { min: 1.5, max: 15.0 }
  }
};
