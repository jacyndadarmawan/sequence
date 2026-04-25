// Seed exercise library — 45 entries across categories.
// Each exercise: { id, name, category, position, difficulty, equipment, purpose, tags, notes, springs, footbar }

const E = (id, name, category, position, difficulty, equipment, purpose, tags, springs, footbar, notes = '') => ({
  id,
  name,
  category,
  position,
  difficulty,
  equipment,
  purpose,
  tags,
  notes,
  springs,
  footbar,
});

export const seedExercises = [
  // Warm-Up
  E('e1', 'Footwork — Parallel', 'Warm-Up', 'Supine', 'Beginner', 'Reformer', 'Warm up the legs, establish spinal neutral', ['footwork', 'legs'], '3 red', 'medium'),
  E('e2', 'Footwork — Parallel Heels', 'Warm-Up', 'Supine', 'Beginner', 'Reformer', 'Calf and ankle mobility, leg press coordination', ['footwork', 'legs'], '3 red', 'medium'),
  E('e3', 'Footwork — V Position', 'Warm-Up', 'Supine', 'Beginner', 'Reformer', 'Hip external rotation, adductor engagement', ['footwork', 'legs'], '3 red', 'medium'),
  E('e4', 'Footwork — Wide Second', 'Warm-Up', 'Supine', 'Beginner', 'Reformer', 'Inner thigh and glute activation', ['footwork', 'glutes'], '3 red', 'medium'),
  E('e5', 'The Hundred', 'Warm-Up', 'Supine', 'Beginner', 'Mat', 'Activates deep abdominals, builds breath rhythm', ['core', 'breath'], '—', '—'),
  E('e6', 'Rolling Like a Ball', 'Warm-Up', 'Seated', 'Beginner', 'Mat', 'Spinal massage, coordination', ['spine', 'massage'], '—', '—'),
  E('e7', 'Pelvic Curl', 'Warm-Up', 'Supine', 'Beginner', 'Mat', 'Articulate the spine, glute activation', ['spine', 'glutes'], '—', '—'),
  E('e8', 'Cat-Cow', 'Warm-Up', 'Quadruped', 'Beginner', 'Mat', 'Spinal mobility, breath cueing', ['spine', 'mobility'], '—', '—'),

  // Core
  E('e9', 'Roll Up', 'Core', 'Supine', 'Intermediate', 'Mat', 'Articulating spinal flexion, deep core', ['core', 'spine'], '—', '—'),
  E('e10', 'Single Leg Stretch', 'Core', 'Supine', 'Beginner', 'Mat', 'Coordination, deep abdominals', ['core', 'coordination'], '—', '—'),
  E('e11', 'Double Leg Stretch', 'Core', 'Supine', 'Intermediate', 'Mat', 'Whole body stretch, core control', ['core', 'control'], '—', '—'),
  E('e12', 'Criss-Cross', 'Core', 'Supine', 'Intermediate', 'Mat', 'Obliques, rotational stability', ['core', 'obliques'], '—', '—'),
  E('e13', 'Teaser', 'Core', 'Supine', 'Advanced', 'Mat', 'Balance, deep core integration', ['core', 'balance'], '—', '—'),
  E('e14', 'Stomach Massage — Round', 'Core', 'Seated', 'Intermediate', 'Reformer', 'Spinal flexion, abdominal lift', ['core', 'spine'], '3 red', 'high'),
  E('e15', 'Stomach Massage — Flat Back', 'Core', 'Seated', 'Intermediate', 'Reformer', 'Spinal extension with deep core', ['core', 'extension'], '3 red', 'high'),
  E('e16', 'Short Spine', 'Core', 'Supine', 'Intermediate', 'Reformer', 'Articulation through the spine, hamstring length', ['core', 'spine'], '2 red', 'low'),
  E('e17', 'Leg Circles', 'Core', 'Supine', 'Beginner', 'Mat', 'Hip mobility with stable pelvis', ['core', 'hips'], '—', '—'),

  // Strength
  E('e18', 'Tendon Stretch', 'Strength', 'Seated', 'Advanced', 'Reformer', 'Calf and achilles lengthening, balance, core control', ['balance', 'calves'], '2 red', 'high'),
  E('e19', 'Arm Circles — Straps', 'Strength', 'Supine', 'Beginner', 'Reformer', 'Shoulder mobility, rotator cuff strength, core stability', ['arms', 'shoulder'], '1 blue', 'flat'),
  E('e20', 'Grasshopper', 'Strength', 'Prone', 'Advanced', 'Reformer', 'Glute and hamstring strength, spinal extension', ['prone', 'glutes'], '1 red', 'flat'),
  E('e21', 'Rowing Front — Reach', 'Strength', 'Seated', 'Intermediate', 'Reformer', 'Posterior chain, spinal flexion, tricep strength', ['rowing', 'arms'], '1 red', 'flat'),
  E('e22', 'Rowing Back — Hug', 'Strength', 'Seated', 'Intermediate', 'Reformer', 'Chest opening, posterior shoulder, core control', ['rowing', 'arms'], '1 red', 'flat'),
  E('e23', 'Long Box — Pulling Straps', 'Strength', 'Prone', 'Intermediate', 'Reformer', 'Thoracic extension, posterior chain, lat strength', ['long box', 'back'], '1 red', 'flat'),
  E('e24', 'Long Box — T Pulls', 'Strength', 'Prone', 'Intermediate', 'Reformer', 'Mid-back strength, scapular stability', ['long box', 'back'], '1 red', 'flat'),
  E('e25', 'Swan on Box', 'Strength', 'Prone', 'Intermediate', 'Reformer', 'Thoracic extension, spinal erector strength', ['extension', 'back'], '1 red', 'flat'),
  E('e26', 'Knee Stretch — Flat Back', 'Strength', 'Kneeling', 'Beginner', 'Reformer', 'Hip extension, lumbar stability, glute activation', ['kneeling', 'glutes'], '1 red', 'flat'),
  E('e27', 'Plank Pike', 'Strength', 'Quadruped', 'Advanced', 'Reformer', 'Total core, shoulder stability', ['plank', 'core'], '1 red', 'flat'),

  // Flexibility
  E('e28', 'Side Splits', 'Flexibility', 'Standing', 'Intermediate', 'Reformer', 'Inner thigh length, balance', ['legs', 'standing'], '2 red', 'flat'),
  E('e29', 'Standing Lunge', 'Flexibility', 'Standing', 'Intermediate', 'Reformer', 'Hip flexor lengthening, single-leg balance', ['legs', 'standing'], '2 red', 'flat'),
  E('e30', 'Spine Stretch Forward', 'Flexibility', 'Seated', 'Beginner', 'Mat', 'Spinal flexion, hamstring release', ['spine', 'hamstrings'], '—', '—'),
  E('e31', 'Saw', 'Flexibility', 'Seated', 'Intermediate', 'Mat', 'Rotation with spinal flexion, hamstring length', ['rotation', 'spine'], '—', '—'),
  E('e32', 'Mermaid', 'Flexibility', 'Seated', 'Beginner', 'Mat', 'Lateral flexion, oblique opening', ['lateral', 'side'], '—', '—'),
  E('e33', 'Thread the Needle', 'Flexibility', 'Quadruped', 'Beginner', 'Mat', 'Thoracic rotation, shoulder mobility', ['rotation', 'shoulder'], '—', '—'),

  // Balance
  E('e34', 'Single Leg Balance', 'Balance', 'Standing', 'Beginner', 'Mat', 'Foot tripod, ankle stability', ['balance', 'standing'], '—', '—'),
  E('e35', 'Standing Foot Work', 'Balance', 'Standing', 'Intermediate', 'Reformer', 'Proprioception, deep ankle control', ['balance', 'feet'], '1 red', 'flat'),
  E('e36', 'Star', 'Balance', 'Side-Lying', 'Advanced', 'Mat', 'Lateral stability, full body integration', ['balance', 'lateral'], '—', '—'),

  // Cool-Down
  E('e37', 'Child\u2019s Pose', 'Cool-Down', 'Kneeling', 'Beginner', 'Mat', 'Hip and back release', ['release', 'hips'], '—', '—'),
  E('e38', 'Supine Twist', 'Cool-Down', 'Supine', 'Beginner', 'Mat', 'Spinal release, hip rotation', ['twist', 'spine'], '—', '—'),
  E('e39', 'Happy Baby', 'Cool-Down', 'Supine', 'Beginner', 'Mat', 'Inner hip release, low-back relief', ['hips', 'release'], '—', '—'),
  E('e40', 'Legs Up Strap', 'Cool-Down', 'Supine', 'Beginner', 'Reformer', 'Hamstring release with passive support', ['hamstrings', 'release'], '1 blue', 'flat'),

  // Breath
  E('e41', 'Lateral Breathing', 'Breath', 'Seated', 'Beginner', 'Mat', 'Rib cage mobility, breath awareness', ['breath', 'ribs'], '—', '—'),
  E('e42', '3-Part Breath', 'Breath', 'Supine', 'Beginner', 'Mat', 'Diaphragmatic breath, parasympathetic reset', ['breath', 'reset'], '—', '—'),
  E('e43', 'Box Breathing', 'Breath', 'Seated', 'Beginner', 'Mat', 'Nervous system regulation', ['breath', 'reset'], '—', '—'),
  E('e44', 'Ocean Breath', 'Breath', 'Seated', 'Beginner', 'Mat', 'Audible breath, focus', ['breath', 'focus'], '—', '—'),
  E('e45', 'Diaphragm Release', 'Breath', 'Supine', 'Beginner', 'Mat', 'Diaphragm mobility, deep breath access', ['breath', 'diaphragm'], '—', '—'),
];

export const seedSequences = [
  {
    id: 's1',
    title: 'Morning Mat Flow',
    description: 'A grounding 45-minute mat class to start the day with intention',
    duration: 45,
    level: 'Intermediate',
    isTemplate: true,
    createdAt: '2026-04-21T09:00:00Z',
    updatedAt: '2026-04-21T09:00:00Z',
    blocks: [
      {
        id: 'b1',
        name: 'Main Block',
        items: [
          { id: 'i1', exerciseId: 'e41', sets: 1, reps: '5 breaths' },
          { id: 'i2', exerciseId: 'e5', sets: 1, reps: '100 counts' },
          { id: 'i3', exerciseId: 'e9', sets: 3, reps: '1' },
          { id: 'i4', exerciseId: 'e17', sets: 1, reps: '5 each way' },
          { id: 'i5', exerciseId: 'e10', sets: 1, reps: '10 each' },
          { id: 'i6', exerciseId: 'e30', sets: 3, reps: '1' },
          { id: 'i7', exerciseId: 'e38', sets: 1, reps: '6 breaths' },
        ],
      },
    ],
    notes: '',
  },
  {
    id: 's2',
    title: 'Thursday Matwork',
    description: 'A total body workout. Mostly intermediate, regular clients with occasional beginners joining.',
    duration: 55,
    level: 'Mixed',
    isTemplate: false,
    createdAt: '2026-04-22T09:00:00Z',
    updatedAt: '2026-04-22T09:00:00Z',
    blocks: [
      {
        id: 'b2', name: 'Warm-Up',
        items: [
          { id: 'i8', exerciseId: 'e7', sets: 1, reps: '8' },
          { id: 'i9', exerciseId: 'e8', sets: 1, reps: '8' },
        ],
      },
      {
        id: 'b3', name: 'Core', items: [
          { id: 'i10', exerciseId: 'e10', sets: 2, reps: '10 each' },
          { id: 'i11', exerciseId: 'e12', sets: 2, reps: '10 each' },
        ],
      },
      {
        id: 'b4', name: 'Cool-Down', items: [
          { id: 'i12', exerciseId: 'e37', sets: 1, reps: '5 breaths' },
        ],
      },
    ],
    notes: '',
  },
  {
    id: 's3',
    title: 'Thursday Matwork #2',
    description: 'A total body workout. Mostly intermediate, regular clients with occasional beginners joining.',
    duration: 55,
    level: 'Mixed',
    isTemplate: false,
    createdAt: '2026-04-23T09:00:00Z',
    updatedAt: '2026-04-23T09:00:00Z',
    blocks: [
      { id: 'b5', name: 'Warm-Up', items: [{ id: 'i13', exerciseId: 'e7', sets: 1, reps: '8' }] },
      { id: 'b6', name: 'Core', items: [{ id: 'i14', exerciseId: 'e10', sets: 2, reps: '10 each' }] },
      { id: 'b7', name: 'Strength', items: [{ id: 'i15', exerciseId: 'e22', sets: 2, reps: '10' }] },
      { id: 'b8', name: 'Cool-Down', items: [{ id: 'i16', exerciseId: 'e37', sets: 1, reps: '5 breaths' }] },
    ],
    notes: '',
  },
  {
    id: 's4',
    title: 'Thursday Matwork #2 (copy)',
    description: 'A total body workout. Mostly intermediate, regular clients with occasional beginners joining.',
    duration: 55,
    level: 'Mixed',
    isTemplate: false,
    createdAt: '2026-04-23T11:00:00Z',
    updatedAt: '2026-04-23T11:00:00Z',
    blocks: [
      { id: 'b9', name: 'Warm-Up', items: [{ id: 'i17', exerciseId: 'e7', sets: 1, reps: '8' }] },
      { id: 'b10', name: 'Core', items: [{ id: 'i18', exerciseId: 'e10', sets: 2, reps: '10 each' }] },
      { id: 'b11', name: 'Strength', items: [{ id: 'i19', exerciseId: 'e22', sets: 2, reps: '10' }] },
      { id: 'b12', name: 'Cool-Down', items: [{ id: 'i20', exerciseId: 'e37', sets: 1, reps: '5 breaths' }] },
    ],
    notes: '',
  },
  {
    id: 's5',
    title: 'Core Intensive',
    description: 'A focused 30 minutes on deep abdominals and obliques.',
    duration: 30,
    level: 'Intermediate',
    isTemplate: false,
    createdAt: '2026-04-15T09:00:00Z',
    updatedAt: '2026-04-15T09:00:00Z',
    blocks: [
      { id: 'b13', name: 'Activation', items: [{ id: 'i21', exerciseId: 'e5', sets: 1, reps: '100' }] },
      { id: 'b14', name: 'Deep Core', items: [
        { id: 'i22', exerciseId: 'e10', sets: 2, reps: '10 each' },
        { id: 'i23', exerciseId: 'e12', sets: 2, reps: '10 each' },
        { id: 'i24', exerciseId: 'e13', sets: 1, reps: '6' },
      ] },
    ],
    notes: '',
  },
];

export const seedHistory = [
  {
    id: 'h1',
    date: '2026-04-18',
    sequenceId: 's1',
    sequenceTitle: 'Morning Mat Flow',
    client: 'Sarah M.',
    duration: 45,
    exerciseCount: 5,
    rating: 5,
    notes: 'Great energy. Sarah held Teaser longer than usual. Try adding side leg series next time.',
  },
  {
    id: 'h2',
    date: '2026-04-15',
    sequenceId: 's5',
    sequenceTitle: 'Core Intensive',
    client: 'Group — Tuesday 9am',
    duration: 30,
    exerciseCount: 3,
    rating: 4,
    notes: 'Group needed more guidance on Criss-Cross. Add a setup cue next week.',
  },
];

export const CATEGORIES = ['Warm-Up', 'Core', 'Strength', 'Flexibility', 'Balance', 'Cool-Down', 'Breath'];
export const POSITIONS = ['Supine', 'Prone', 'Side-Lying', 'Standing', 'Seated', 'Quadruped', 'Kneeling'];
export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
export const EQUIPMENT = ['Mat', 'Reformer', 'Cadillac', 'Barrel', 'Chair', 'Ring', 'Ball', 'Band', 'None'];
export const SPRING_OPTIONS = ['—', '1 blue', '1 red', '2 red', '3 red', '1 yellow', '2 yellow', 'mixed'];
export const FOOTBAR_OPTIONS = ['—', 'flat', 'low', 'medium', 'high'];

export const CATEGORY_COLOR = {
  'Warm-Up': { bg: 'bg-peach', text: 'text-peach-ink' },
  Core: { bg: 'bg-mauve', text: 'text-mauve-ink' },
  Strength: { bg: 'bg-mauve', text: 'text-mauve-ink' },
  Flexibility: { bg: 'bg-sage', text: 'text-sage-ink' },
  Balance: { bg: 'bg-mint', text: 'text-mint-ink' },
  'Cool-Down': { bg: 'bg-mint', text: 'text-mint-ink' },
  Breath: { bg: 'bg-wheat', text: 'text-wheat-ink' },
};

export const POSITION_COLOR = {
  Supine: { bg: 'bg-sage', text: 'text-sage-ink' },
  Prone: { bg: 'bg-peach', text: 'text-peach-ink' },
  'Side-Lying': { bg: 'bg-mauve', text: 'text-mauve-ink' },
  Standing: { bg: 'bg-mint', text: 'text-mint-ink' },
  Seated: { bg: 'bg-sage', text: 'text-sage-ink' },
  Quadruped: { bg: 'bg-wheat', text: 'text-wheat-ink' },
  Kneeling: { bg: 'bg-wheat', text: 'text-wheat-ink' },
};
