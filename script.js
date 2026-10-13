//код написан с помощью chat gpt

Tone.Transport.bpm.value = 96;
Tone.Transport.timeSignature = 4;

Tone.Destination.volume.value = -6;

const playing = {
  pressure: false,
  pressurePlus: false,
  wind: false,
  windPlus: false,
  precipitation: false
};

let echoEnabled = false;
let turbulenceEnabled = false;
let pulseEnabled = false;
let spaceEnabled = false;

function getNextStartTime() {
  if (Tone.Transport.state !== 'started') {
    return 0;
  }

  return Tone.Transport.nextSubdivision('8n');
}

async function startInstrument(key, sequence) {
  if (playing[key]) return;

  playing[key] = true;

  try {
    await Tone.start();

    const startTime = getNextStartTime();

    sequence.start(startTime);

    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    }
  } catch (error) {
    playing[key] = false;

    console.error(`Ошибка запуска ${key}:`, error);
  }
}

function stopInstrument(key, sequence, synth) {
  if (!playing[key]) return;

  playing[key] = false;

  sequence.stop();

  if (synth) {
    synth.releaseAll();
  }

  stopTransportIfIdle();
}

function stopTransportIfIdle() {
  const anythingPlaying = Object.values(playing).some(Boolean);

  if (!anythingPlaying) {
    Tone.Transport.stop();
    Tone.Transport.position = 0;
  }
}

function createMelodySequence(
  synth,
  melody,
  duration,
  velocity,
  getTranspose = () => 0
) {
  const sequence = new Tone.Sequence(
    (time, note) => {
      if (note === null) return;

      const transpose = getTranspose();

      const finalNote = transpose
        ? Tone.Frequency(note).transpose(transpose).toNote()
        : note;

      synth.triggerAttackRelease(finalNote, duration, time, velocity);
    },

    melody,

    '4n'
  );

  sequence.loop = true;

  return sequence;
}

const delay1 = new Tone.FeedbackDelay({
  delayTime: '8n',
  feedback: 0.28,
  wet: 0
});

const distortion1 = new Tone.Distortion({
  distortion: 0.55,
  oversample: '4x',
  wet: 0
});

const vibrato1 = new Tone.Vibrato({
  frequency: 1.5,
  depth: 0.08,
  wet: 0
});

const tremolo1 = new Tone.Tremolo({
  frequency: 4,
  depth: 0.35,
  wet: 0
}).start();

const filter1 = new Tone.Filter({
  frequency: 12000,
  type: 'lowpass',
  rolloff: -12
});

const chorus1 = new Tone.Chorus({
  frequency: 0.35,
  delayTime: 4,
  depth: 0.3,
  wet: 0
}).start();

const reverb1 = new Tone.Reverb({
  decay: 3.5,
  wet: 0.22
});

const synth1 = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    type: 'sine'
  },

  envelope: {
    attack: 0.18,
    decay: 0.3,
    sustain: 0.65,
    release: 2.5
  },

  volume: -11
});

synth1.connect(chorus1);
chorus1.connect(vibrato1);
vibrato1.connect(tremolo1);
tremolo1.connect(distortion1);
distortion1.connect(filter1);
filter1.connect(delay1);
delay1.connect(reverb1);
reverb1.toDestination();

const melody1 = [
  'A4',
  null,
  'C5',
  'E5',
  'B4',
  null,
  'A4',
  null,
  'G4',
  'A4',
  'C5',
  null,
  'E5',
  null,
  'C5',
  null,

  'A4',
  null,
  'C5',
  'E5',
  'F5',
  null,
  'E5',
  null,
  'C5',
  'A4',
  'G4',
  null,
  'A4',
  null,
  'C5',
  null,

  'G4',
  null,
  'B4',
  'C5',
  'E5',
  null,
  'G5',
  null,
  'E5',
  'D5',
  'C5',
  null,
  'B4',
  null,
  'G4',
  null,

  'G4',
  null,
  'B4',
  'D5',
  'E5',
  null,
  'D5',
  null,
  'B4',
  'G4',
  'E4',
  null,
  'G4',
  null,
  'A4',
  null
];

const pressureSection = document.querySelector('.pressure');

const waveButtons1 = [
  pressureSection.querySelector('.button-wv-1'),
  pressureSection.querySelector('.button-wv-2')
];

const waveSettings1 = [
  {
    type: 'sine',
    transpose: 0,
    attack: 0.18,
    release: 2.5,
    chorus: 0,
    filter: 12000
  },

  {
    type: 'sine',
    transpose: -12,
    attack: 0.65,
    release: 4,
    chorus: 0.55,
    filter: 6500
  }
];

let currentWave1 = waveSettings1[0];

const sequence1 = createMelodySequence(
  synth1,
  melody1,
  '8n',
  0.8,
  () => currentWave1.transpose
);

const play1 = document.getElementById('play1');
const stop1 = document.getElementById('stop1');

play1.addEventListener('click', async () => {
  await startInstrument('pressure', sequence1);
});

stop1.addEventListener('click', () => {
  stopInstrument('pressure', sequence1, synth1);
});

waveButtons1.forEach((button, index) => {
  button.addEventListener('click', () => {
    currentWave1 = waveSettings1[index];

    synth1.set({
      oscillator: {
        type: currentWave1.type
      },

      envelope: {
        attack: currentWave1.attack,
        decay: 0.3,
        sustain: 0.65,
        release: currentWave1.release
      }
    });

    chorus1.wet.rampTo(currentWave1.chorus, 0.4);

    if (!turbulenceEnabled) {
      filter1.frequency.rampTo(currentWave1.filter, 0.4);
    }

    waveButtons1.forEach((btn) => {
      btn.classList.remove('active');
    });

    button.classList.add('active');
  });
});

waveButtons1[0].classList.add('active');

const echoButton = pressureSection.querySelector('.button-echo');

echoButton.addEventListener('click', () => {
  echoEnabled = !echoEnabled;

  delay1.wet.rampTo(echoEnabled ? 0.45 : 0, 0.3);

  echoButton.classList.toggle('active', echoEnabled);
});

const turbulenceButton = pressureSection.querySelector('.button-turbulence');

turbulenceButton.addEventListener('click', () => {
  turbulenceEnabled = !turbulenceEnabled;

  distortion1.wet.rampTo(turbulenceEnabled ? 0.65 : 0, 0.5);

  vibrato1.wet.rampTo(turbulenceEnabled ? 0.4 : 0, 0.5);

  tremolo1.wet.rampTo(turbulenceEnabled ? 0.35 : 0, 0.5);

  filter1.frequency.rampTo(turbulenceEnabled ? 2400 : currentWave1.filter, 0.6);

  turbulenceButton.classList.toggle('active', turbulenceEnabled);
});

const pressurePlusFilter = new Tone.Filter({
  frequency: 4300,
  type: 'lowpass',
  rolloff: -12
});

const pressurePlusChorus = new Tone.Chorus({
  frequency: 0.28,
  delayTime: 5,
  depth: 0.55,
  wet: 0.45
}).start();

const pressurePlusVibrato = new Tone.Vibrato({
  frequency: 2.2,
  depth: 0.09,
  wet: 0.35
});

const pressurePlusDelay = new Tone.FeedbackDelay({
  delayTime: '4n.',
  feedback: 0.22,
  wet: 0.2
});

const pressurePlusReverb = new Tone.Reverb({
  decay: 5.5,
  wet: 0.4
});

const pressurePlusSynth = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    type: 'triangle'
  },

  envelope: {
    attack: 0.4,
    decay: 0.45,
    sustain: 0.65,
    release: 3.8
  },

  volume: -12
});

pressurePlusSynth.connect(pressurePlusFilter);
pressurePlusFilter.connect(pressurePlusChorus);
pressurePlusChorus.connect(pressurePlusVibrato);
pressurePlusVibrato.connect(pressurePlusDelay);
pressurePlusDelay.connect(pressurePlusReverb);
pressurePlusReverb.toDestination();

const pressurePlusMelody = [
  null,
  null,
  'E5',
  null,
  'A5',
  null,
  null,
  'G5',
  null,
  'E5',
  null,
  'B5',
  null,
  'A5',
  'G5',
  null,

  null,
  'C6',
  null,
  'A5',
  null,
  null,
  'E5',
  'F5',
  'A5',
  null,
  'G5',
  null,
  'E5',
  null,
  null,
  'C5',

  null,
  'B5',
  null,
  'G5',
  'E5',
  null,
  null,
  'D5',
  null,
  'G5',
  'C6',
  null,
  'B5',
  null,
  'G5',
  null,

  'B5',
  null,
  'G5',
  null,
  'D5',
  'E5',
  null,
  null,
  'G5',
  null,
  'B5',
  'A5',
  null,
  'E5',
  null,
  null
];

const pressurePlusSequence = createMelodySequence(
  pressurePlusSynth,
  pressurePlusMelody,
  '4n',
  0.72
);

const pressurePlusButton = pressureSection.querySelector('.button-wv-3');

const pressureMinusButton = pressureSection.querySelector('.button-wv-4');

pressurePlusButton.addEventListener('click', async () => {
  await startInstrument('pressurePlus', pressurePlusSequence);

  if (playing.pressurePlus) {
    pressurePlusButton.classList.add('active');
  }
});

pressureMinusButton.addEventListener('click', () => {
  stopInstrument('pressurePlus', pressurePlusSequence, pressurePlusSynth);

  pressurePlusButton.classList.remove('active');
});

const chorus2 = new Tone.Chorus({
  frequency: 0.25,
  delayTime: 5,
  depth: 0.35,
  wet: 0.3
}).start();

const filter2 = new Tone.Filter({
  frequency: 6000,
  type: 'lowpass',
  rolloff: -12
});

const tremolo2 = new Tone.Tremolo({
  frequency: 2,
  depth: 0.45,
  wet: 0
}).start();

const reverb2 = new Tone.Reverb({
  decay: 6,
  wet: 0.3
});

const widener2 = new Tone.StereoWidener({
  width: 0.5
});

const synth2 = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    type: 'sine'
  },

  envelope: {
    attack: 0.7,
    decay: 0.4,
    sustain: 0.7,
    release: 3.5
  },

  volume: -14
});

synth2.connect(chorus2);
chorus2.connect(filter2);
filter2.connect(tremolo2);
tremolo2.connect(reverb2);
reverb2.connect(widener2);
widener2.toDestination();

const melody2 = [
  // Am(add9)
  'A3',
  null,
  null,
  'E4',
  null,
  'C4',
  null,
  null,
  'E4',
  null,
  'B3',
  null,
  'C4',
  null,
  null,
  'E4',

  // Fmaj7
  'F3',
  null,
  null,
  'C4',
  null,
  'A3',
  null,
  null,
  'C4',
  null,
  'E4',
  null,
  'A3',
  null,
  null,
  'C4',

  // Cmaj7
  'C4',
  null,
  null,
  'G3',
  null,
  'E4',
  null,
  null,
  'G3',
  null,
  'B3',
  null,
  'E4',
  null,
  null,
  'G3',

  // Em7
  'E3',
  null,
  null,
  'B3',
  null,
  'G3',
  null,
  null,
  'B3',
  null,
  'D4',
  null,
  'G3',
  null,
  null,
  'E4'
];

const windSection = document.querySelector('.wind');

const waveButtons2 = [
  windSection.querySelector('.button-wv-1'),
  windSection.querySelector('.button-wv-2')
];

const waveSettings2 = [
  {
    type: 'sine',
    transpose: 0,
    attack: 0.7,
    release: 3.5,
    chorus: 0.3,
    filter: 6000
  },

  {
    type: 'sine',
    transpose: 12,
    attack: 0.35,
    release: 2.5,
    chorus: 0.45,
    filter: 10000
  }
];

let currentWave2 = waveSettings2[0];

const sequence2 = createMelodySequence(
  synth2,
  melody2,
  '2n',
  0.65,
  () => currentWave2.transpose
);

const play2 = document.getElementById('play2');
const stop2 = document.getElementById('stop2');

play2.addEventListener('click', async () => {
  await startInstrument('wind', sequence2);
});

stop2.addEventListener('click', () => {
  stopInstrument('wind', sequence2, synth2);
});

waveButtons2.forEach((button, index) => {
  button.addEventListener('click', () => {
    currentWave2 = waveSettings2[index];

    synth2.set({
      oscillator: {
        type: currentWave2.type
      },

      envelope: {
        attack: currentWave2.attack,
        decay: 0.4,
        sustain: 0.7,
        release: currentWave2.release
      }
    });

    chorus2.wet.rampTo(currentWave2.chorus, 0.5);

    filter2.frequency.rampTo(currentWave2.filter, 0.5);

    waveButtons2.forEach((btn) => {
      btn.classList.remove('active');
    });

    button.classList.add('active');
  });
});

waveButtons2[0].classList.add('active');

const pulseButton = windSection.querySelector('.button-pulse');

pulseButton.addEventListener('click', () => {
  pulseEnabled = !pulseEnabled;

  tremolo2.wet.rampTo(pulseEnabled ? 0.65 : 0, 0.5);

  pulseButton.classList.toggle('active', pulseEnabled);
});

const spaceButton = windSection.querySelector('.button-space');

spaceButton.addEventListener('click', () => {
  spaceEnabled = !spaceEnabled;

  reverb2.wet.rampTo(spaceEnabled ? 0.65 : 0.3, 0.8);

  widener2.width.rampTo(spaceEnabled ? 0.9 : 0.5, 0.8);

  spaceButton.classList.toggle('active', spaceEnabled);
});

const windPlusFilter = new Tone.Filter({
  frequency: 7500,
  type: 'lowpass',
  rolloff: -12
});

const windPlusChorus = new Tone.Chorus({
  frequency: 0.5,
  delayTime: 3.5,
  depth: 0.5,
  wet: 0.5
}).start();

const windPlusDelay = new Tone.FeedbackDelay({
  delayTime: '8n.',
  feedback: 0.25,
  wet: 0.23
});

const windPlusReverb = new Tone.Reverb({
  decay: 5,
  wet: 0.42
});

const windPlusWidener = new Tone.StereoWidener({
  width: 0.8
});

const windPlusSynth = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    type: 'sine'
  },

  envelope: {
    attack: 0.07,
    decay: 0.25,
    sustain: 0.5,
    release: 2.5
  },

  volume: -15
});

windPlusSynth.connect(windPlusFilter);
windPlusFilter.connect(windPlusChorus);
windPlusChorus.connect(windPlusDelay);
windPlusDelay.connect(windPlusReverb);
windPlusReverb.connect(windPlusWidener);
windPlusWidener.toDestination();

const windPlusMelody = [
  'E5',
  'B5',
  null,
  'A5',
  'G5',
  null,
  'E5',
  'C5',
  null,
  'B4',
  'E5',
  null,
  'A5',
  'G5',
  null,
  'E5',

  'F5',
  'A5',
  null,
  'C6',
  'A5',
  null,
  'G5',
  'E5',
  null,
  'C5',
  'F5',
  'A5',
  null,
  'G5',
  'E5',
  null,

  'E5',
  'G5',
  null,
  'B5',
  'C6',
  null,
  'G5',
  'E5',
  null,
  'D5',
  'G5',
  'B5',
  null,
  'G5',
  'E5',
  null,

  'D5',
  'G5',
  null,
  'B5',
  'G5',
  null,
  'E5',
  'D5',
  null,
  'B4',
  'E5',
  'G5',
  'A5',
  null,
  'E5',
  null
];

const windPlusSequence = createMelodySequence(
  windPlusSynth,
  windPlusMelody,
  '8n',
  0.7
);

const windPlusButton = windSection.querySelector('.button-wv-3');

const windMinusButton = windSection.querySelector('.button-wv-4');

windPlusButton.addEventListener('click', async () => {
  await startInstrument('windPlus', windPlusSequence);

  if (playing.windPlus) {
    windPlusButton.classList.add('active');
  }
});

windMinusButton.addEventListener('click', () => {
  stopInstrument('windPlus', windPlusSequence, windPlusSynth);

  windPlusButton.classList.remove('active');
});

const thunder = new Tone.MembraneSynth({
  pitchDecay: 0.12,
  octaves: 4,

  oscillator: {
    type: 'sine'
  },

  envelope: {
    attack: 0.005,
    decay: 1.2,
    sustain: 0,
    release: 1.5
  },

  volume: -15
});

const lightning = new Tone.NoiseSynth({
  noise: {
    type: 'pink'
  },

  envelope: {
    attack: 0.001,
    decay: 0.12,
    sustain: 0,
    release: 0.1
  },

  volume: -22
});

const rain = new Tone.NoiseSynth({
  noise: {
    type: 'pink'
  },

  envelope: {
    attack: 0.001,
    decay: 0.055,
    sustain: 0,
    release: 0.05
  },

  volume: -27
});

const thunderFilter = new Tone.Filter({
  frequency: 350,
  type: 'lowpass'
});

const lightningFilter = new Tone.Filter({
  frequency: 1800,
  type: 'bandpass',
  Q: 0.7
});

const rainFilter = new Tone.Filter({
  frequency: 4500,
  type: 'highpass'
});

const reverb3 = new Tone.Reverb({
  decay: 3,
  wet: 0.25
});

thunder.connect(thunderFilter);
thunderFilter.connect(reverb3);

lightning.connect(lightningFilter);
lightningFilter.connect(reverb3);

rain.connect(rainFilter);
rainFilter.connect(reverb3);

reverb3.toDestination();

const drumPattern = {
  thunder: [true, false, false, false, true, false, false, false],

  lightning: [false, false, true, false, false, false, true, false],

  rain: [true, true, true, true, true, true, true, true]
};

const prcRows = document.querySelectorAll('.prc-row');

prcRows.forEach((row) => {
  const instrument = row.dataset.instrument;

  const buttons = row.querySelectorAll('.prc-step');

  buttons.forEach((button, index) => {
    button.classList.toggle('active', drumPattern[instrument][index]);

    button.setAttribute('aria-pressed', String(drumPattern[instrument][index]));

    button.addEventListener('click', () => {
      drumPattern[instrument][index] = !drumPattern[instrument][index];

      button.classList.toggle('active', drumPattern[instrument][index]);

      button.setAttribute(
        'aria-pressed',
        String(drumPattern[instrument][index])
      );
    });
  });
});

const drumSteps = [0, 1, 2, 3, 4, 5, 6, 7];

const drumSequence = new Tone.Sequence(
  (time, step) => {
    if (drumPattern.thunder[step]) {
      thunder.triggerAttackRelease('C1', '8n', time);
    }

    if (drumPattern.lightning[step]) {
      lightning.triggerAttackRelease('16n', time);
    }

    if (drumPattern.rain[step]) {
      rain.triggerAttackRelease('32n', time);
    }

    Tone.Draw.schedule(() => {
      if (!playing.precipitation) return;

      document.querySelectorAll('.prc-step').forEach((button) => {
        button.classList.remove('playing');
      });

      prcRows.forEach((row) => {
        const buttons = row.querySelectorAll('.prc-step');

        buttons[step].classList.add('playing');
      });
    }, time);
  },

  drumSteps,

  '8n'
);

drumSequence.loop = true;

const play3 = document.getElementById('play3');
const stop3 = document.getElementById('stop3');

play3.addEventListener('click', async () => {
  await startInstrument('precipitation', drumSequence);
});

stop3.addEventListener('click', () => {
  if (!playing.precipitation) return;

  playing.precipitation = false;

  drumSequence.stop();

  document.querySelectorAll('.prc-step').forEach((button) => {
    button.classList.remove('playing');
  });

  stopTransportIfIdle();
});

let audioInitialized = false;

async function initAudio() {
  await Tone.start();

  if (!audioInitialized) {
    tremolo1.start();

    chorus1.start();

    pressurePlusChorus.start();

    chorus2.start();

    tremolo2.start();

    windPlusChorus.start();

    audioInitialized = true;

    console.log('Аудиосистема ИЗОСИНТА запущена');
  }
}
