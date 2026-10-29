Tone.Transport.bpm.value = 95;
Tone.Transport.timeSignature = 4;

const master = new Tone.Gain(0.65).toDestination();

const GLOBAL_FADE_IN = 1.5;
const GLOBAL_FADE_OUT = 2;

const PRC_FADE_OUT = 0.7;

const PRC_TARGET_VOLUME = 0.25;

const pressureEcho = new Tone.FeedbackDelay({
  delayTime: '8n',
  feedback: 0.35,
  wet: 0
}).connect(master);

const windEcho = new Tone.FeedbackDelay({
  delayTime: '4n',
  feedback: 0.3,
  wet: 0
}).connect(master);

const pressureMainVolume = new Tone.Gain(0).connect(pressureEcho);
const pressureExtraVolume = new Tone.Gain(0).connect(pressureEcho);

const windMainVolume = new Tone.Gain(0).connect(windEcho);
const windExtraVolume = new Tone.Gain(0).connect(windEcho);

const prcVolume = new Tone.Gain(PRC_TARGET_VOLUME).connect(master);

const pressureMainSynth = new Tone.MonoSynth({
  oscillator: {
    type: 'triangle'
  },

  envelope: {
    attack: 0.01,
    decay: 0.2,
    sustain: 0.2,
    release: 0.3
  },

  filterEnvelope: {
    attack: 0.01,
    decay: 0.2,
    sustain: 0.2,
    release: 0.3,
    baseFrequency: 300,
    octaves: 2
  }
}).connect(pressureMainVolume);

const pressureExtraReverb = new Tone.Reverb({
  decay: 2.8,
  preDelay: 0.025,
  wet: 0.28
}).connect(pressureExtraVolume);

const pressureExtraFilter = new Tone.Filter({
  type: 'lowpass',
  frequency: 6500,
  rolloff: -12
}).connect(pressureExtraReverb);

const pressureExtraChorus = new Tone.Chorus({
  frequency: 0.25,
  delayTime: 2.5,
  depth: 0.12,
  wet: 0.12
}).connect(pressureExtraFilter);

pressureExtraChorus.start();

const pressureExtraSynth = new Tone.PolySynth(Tone.FMSynth, {
  harmonicity: 2.01,
  modulationIndex: 1.5,

  oscillator: {
    type: 'sine'
  },

  modulation: {
    type: 'sine'
  },

  envelope: {
    attack: 0.035,
    decay: 0.65,
    sustain: 0.08,
    release: 1.5
  },

  modulationEnvelope: {
    attack: 0.01,
    decay: 0.35,
    sustain: 0,
    release: 0.8
  }
}).connect(pressureExtraChorus);

const windMainSynth = new Tone.Synth({
  oscillator: {
    type: 'sine'
  },

  envelope: {
    attack: 1.8,
    decay: 0,
    sustain: 1,
    release: 1.5
  },

  volume: -3
}).connect(windMainVolume);

const windExtraReverb = new Tone.Reverb({
  decay: 2.6,
  preDelay: 0.02,
  wet: 0.25
}).connect(windExtraVolume);

const windExtraFilter = new Tone.Filter({
  type: 'lowpass',
  frequency: 4800,
  rolloff: -12
}).connect(windExtraReverb);

const windExtraChorus = new Tone.Chorus({
  frequency: 0.32,
  delayTime: 3,
  depth: 0.16,
  wet: 0.14
}).connect(windExtraFilter);

windExtraChorus.start();

const windExtraSynth = new Tone.PolySynth(Tone.FMSynth, {
  harmonicity: 1.5,
  modulationIndex: 0.8,

  oscillator: {
    type: 'sine'
  },

  modulation: {
    type: 'sine'
  },

  envelope: {
    attack: 0.06,
    decay: 0.3,
    sustain: 0.18,
    release: 0.9
  },

  modulationEnvelope: {
    attack: 0.02,
    decay: 0.2,
    sustain: 0,
    release: 0.4
  }
}).connect(windExtraChorus);

const thunderVolume = new Tone.Gain(0.65).connect(prcVolume);

const thunder = new Tone.MembraneSynth({
  pitchDecay: 0.12,
  octaves: 3,

  oscillator: {
    type: 'sine'
  },

  envelope: {
    attack: 0.04,
    decay: 1.2,
    sustain: 0,
    release: 1.5
  }
}).connect(thunderVolume);

const lightningVolume = new Tone.Gain(0.22).connect(prcVolume);

const lightning = new Tone.MetalSynth({
  frequency: 280,

  envelope: {
    attack: 0.001,
    decay: 0.2,
    release: 0.15
  },

  harmonicity: 3.1,
  modulationIndex: 8,
  resonance: 1200,
  octaves: 1
}).connect(lightningVolume);

const rainVolume = new Tone.Gain(0.35).connect(prcVolume);

const rainFilter = new Tone.Filter({
  type: 'bandpass',
  frequency: 1800,
  Q: 0.8
}).connect(rainVolume);

const rain = new Tone.NoiseSynth({
  noise: {
    type: 'pink'
  },

  envelope: {
    attack: 0.015,
    decay: 0.18,
    sustain: 0,
    release: 0.12
  }
}).connect(rainFilter);

const pressureMainNotes = [
  ['0:0:0', 'E3', '2n'],
  ['0:1:0', 'E3', '2n'],
  ['0:2:0', 'E3', '4n'],
  ['0:2:2', 'E3', '4n'],
  ['0:3:0', 'E3', '2n'],

  ['1:0:0', 'D3', '2n'],
  ['1:1:0', 'D3', '2n'],
  ['1:2:0', 'D3', '4n'],
  ['1:2:2', 'C3', '4n'],
  ['1:3:0', 'D3', '2n'],

  ['2:0:0', 'E3', '2n'],
  ['2:1:0', 'E3', '2n'],
  ['2:2:0', 'E3', '4n'],
  ['2:2:2', 'E3', '4n'],
  ['2:3:0', 'E3', '2n'],

  ['3:0:0', 'D3', '2n'],
  ['3:1:0', 'D3', '2n'],
  ['3:2:0', 'D3', '4n'],
  ['3:2:2', 'C3', '4n'],
  ['3:3:0', 'D3', '2n']
];

const pressureExtraNotes = [
  ['0:0:0', 'E5', '4n'],
  ['0:1:0', 'G5', '8n'],
  ['0:1:2', 'G5', '8n'],
  ['0:2:0', 'E5', '4n'],
  ['0:3:0', 'D5', '4n'],

  ['1:0:0', 'E5', '4n'],
  ['1:1:0', 'G5', '8n'],
  ['1:1:2', 'G5', '8n'],
  ['1:2:0', 'E5', '4n'],
  ['1:3:0', 'D5', '4n'],

  ['2:0:0', 'G5', '4n'],
  ['2:1:0', 'A5', '8n'],
  ['2:1:2', 'G5', '8n'],
  ['2:2:0', 'E5', '4n'],
  ['2:3:0', 'D5', '4n'],

  ['3:0:0', 'E5', '4n'],
  ['3:1:0', 'G5', '8n'],
  ['3:1:2', 'G5', '8n'],
  ['3:2:0', 'E5', '4n'],
  ['3:3:0', 'D5', '4n']
];

const windMainNotes = [
  ['0:0:0', 'D3'],
  ['1:0:0', 'C3'],
  ['2:0:0', 'D3'],
  ['3:0:0', 'C3']
];

const windExtraNotes = [
  ['0:0:0', 'G4', '8n'],
  ['0:0:2', 'E4', '8n'],
  ['0:1:0', 'G4', '8n'],
  ['0:1:2', 'E4', '8n'],
  ['0:2:0', 'D4', '4n'],
  ['0:3:0', 'G4', '8n'],
  ['0:3:2', 'A4', '16n'],
  ['0:3:3', 'G4', '16n'],

  ['1:0:0', 'G4', '8n'],
  ['1:0:2', 'E4', '8n'],
  ['1:1:0', 'G4', '8n'],
  ['1:1:2', 'E4', '8n'],
  ['1:2:0', 'D4', '4n'],
  ['1:3:0', 'G4', '8n'],
  ['1:3:2', 'A4', '16n'],
  ['1:3:3', 'G4', '16n'],

  ['2:0:0', 'A4', '8n'],
  ['2:0:2', 'G4', '8n'],
  ['2:1:0', 'A4', '8n'],
  ['2:1:2', 'G4', '8n'],
  ['2:2:0', 'E4', '4n'],
  ['2:3:0', 'G4', '8n'],
  ['2:3:2', 'A4', '16n'],
  ['2:3:3', 'G4', '16n'],

  ['3:0:0', 'G4', '8n'],
  ['3:0:2', 'E4', '8n'],
  ['3:1:0', 'G4', '8n'],
  ['3:1:2', 'E4', '8n'],
  ['3:2:0', 'D4', '4n'],
  ['3:3:0', 'G4', '8n'],
  ['3:3:2', 'A4', '16n'],
  ['3:3:3', 'G4', '16n']
];

function createPart(synth, notes) {
  const events = notes.map(([time, note, duration]) => ({
    time,
    note,
    duration
  }));

  const part = new Tone.Part((time, event) => {
    synth.triggerAttackRelease(event.note, event.duration, time);
  }, events);

  part.loop = true;
  part.loopEnd = '4m';
  part.start(0);

  return part;
}

createPart(pressureMainSynth, pressureMainNotes);
createPart(pressureExtraSynth, pressureExtraNotes);
createPart(windExtraSynth, windExtraNotes);

const windGlideTime = 1.8;
let windMainVoiceStarted = false;

const windMainPart = new Tone.Part(
  (time, event) => {
    if (!windMainVoiceStarted) {
      windMainSynth.triggerAttack(event.note, time);
      windMainVoiceStarted = true;
    } else {
      const targetFrequency = Tone.Frequency(event.note).toFrequency();

      windMainSynth.frequency.setTargetAtTime(
        targetFrequency,
        time,
        windGlideTime / 3
      );
    }
  },

  windMainNotes.map(([time, note]) => ({
    time,
    note
  }))
);

windMainPart.loop = true;
windMainPart.loopEnd = '4m';
windMainPart.start(0);

const prcSteps = {
  thunder: Array(8).fill(false),
  lightning: Array(8).fill(false),
  rain: Array(8).fill(false)
};

let prcPlaying = false;
let prcCurrentStep = 0;

let globalStopTimer = null;

const prcSequence = new Tone.Sequence(
  (time, step) => {
    prcCurrentStep = step;

    if (!prcPlaying) return;

    if (prcSteps.thunder[step]) {
      thunder.triggerAttackRelease('C2', '8n', time);
    }

    if (prcSteps.lightning[step]) {
      lightning.triggerAttackRelease('16n', time);
    }

    if (prcSteps.rain[step]) {
      rain.triggerAttackRelease('16n', time);
    }

    Tone.Draw.schedule(() => {
      updatePrcPlayhead(step);
    }, time);
  },

  [0, 1, 2, 3, 4, 5, 6, 7],
  '8n'
);

prcSequence.start(0);

function updatePrcPlayhead(step) {
  document.querySelectorAll('.prc-row').forEach((row) => {
    const cells = row.querySelectorAll('.prc-step');

    cells.forEach((cell, index) => {
      cell.classList.toggle('is-current', prcPlaying && index === step);
    });
  });
}

document.querySelectorAll('.prc-row').forEach((row) => {
  const instrument = row.dataset.instrument;
  const cells = row.querySelectorAll('.prc-step');

  if (!Object.prototype.hasOwnProperty.call(prcSteps, instrument)) {
    return;
  }

  cells.forEach((cell, step) => {
    cell.setAttribute('aria-pressed', String(prcSteps[instrument][step]));

    cell.addEventListener('click', () => {
      prcSteps[instrument][step] = !prcSteps[instrument][step];

      const isActive = prcSteps[instrument][step];

      cell.classList.toggle('is-active', isActive);
      cell.setAttribute('aria-pressed', String(isActive));
    });
  });
});

const state = {
  pressure: {
    main: false,
    extra: false
  },

  wind: {
    main: false,
    extra: false
  },

  prc: {
    playing: false
  }
};

const layerVolumes = new Map([
  [
    pressureMainVolume,
    {
      id: 'pressure-main-volume',
      module: 'pressure',
      layer: 'main',
      max: 0.4782,
      value: 0
    }
  ],

  [
    pressureExtraVolume,
    {
      id: 'pressure-extra-volume',
      module: 'pressure',
      layer: 'extra',
      max: 1,
      value: 0
    }
  ],

  [
    windMainVolume,
    {
      id: 'wind-main-volume',
      module: 'wind',
      layer: 'main',
      max: 0.1788,
      value: 0
    }
  ],

  [
    windExtraVolume,
    {
      id: 'wind-extra-volume',
      module: 'wind',
      layer: 'extra',
      max: 0.8784,
      value: 0
    }
  ]
]);

function setLayerVolume(gain, enabled, smoothing = 0.3) {
  const volume = layerVolumes.get(gain);

  gain.gain.rampTo(enabled ? volume.max * volume.value : 0, smoothing);
}

function updateVolumeMeter(volume) {
  const input = document.getElementById(volume.id);
  const meter = input.closest('.meter');

  const percent = Math.round(volume.value * 100);

  input.value = String(percent);

  meter.style.setProperty('--meter-level', percent + '%');

  input.setAttribute('aria-valuetext', percent + '%');
}

function setVolumePreset(gain, percent, smoothing = 0.3) {
  const volume = layerVolumes.get(gain);

  volume.value = percent / 100;

  updateVolumeMeter(volume);

  setLayerVolume(gain, state[volume.module][volume.layer], smoothing);
}

let audioReadyPromise = null;

async function ensureAudioStarted() {
  if (!audioReadyPromise) {
    audioReadyPromise = (async () => {
      await Tone.start();

      if (Tone.Transport.state !== 'started') {
        Tone.Transport.start();
      }
    })().catch((error) => {
      audioReadyPromise = null;
      throw error;
    });
  }

  return audioReadyPromise;
}

async function startPressure() {
  await ensureAudioStarted();

  state.pressure.main = true;
  setLayerVolume(pressureMainVolume, true);

  syncButtonStates();
}

function stopPressure() {
  state.pressure.main = false;
  setLayerVolume(pressureMainVolume, false);

  syncButtonStates();
}

async function startPressureExtra() {
  await ensureAudioStarted();

  state.pressure.extra = true;
  setLayerVolume(pressureExtraVolume, true);

  syncButtonStates();
}

function stopPressureExtra() {
  state.pressure.extra = false;
  setLayerVolume(pressureExtraVolume, false);

  syncButtonStates();
}

async function startWind() {
  await ensureAudioStarted();

  state.wind.main = true;
  setLayerVolume(windMainVolume, true);

  syncButtonStates();
}

function stopWind() {
  state.wind.main = false;
  setLayerVolume(windMainVolume, false);

  syncButtonStates();
}

async function startWindExtra() {
  await ensureAudioStarted();

  state.wind.extra = true;
  setLayerVolume(windExtraVolume, true);

  syncButtonStates();
}

function stopWindExtra() {
  state.wind.extra = false;
  setLayerVolume(windExtraVolume, false);

  syncButtonStates();
}

async function startPrc() {
  await ensureAudioStarted();

  if (globalStopTimer !== null) {
    clearTimeout(globalStopTimer);
    globalStopTimer = null;
  }

  prcPlaying = true;
  state.prc.playing = true;

  prcVolume.gain.rampTo(PRC_TARGET_VOLUME, 0.3);

  syncButtonStates();
}

function stopPrc() {
  if (globalStopTimer !== null) {
    clearTimeout(globalStopTimer);
    globalStopTimer = null;
  }

  prcPlaying = false;
  state.prc.playing = false;

  prcVolume.gain.rampTo(0, 0.3);

  document.querySelectorAll('.prc-step').forEach((cell) => {
    cell.classList.remove('is-current');
  });

  syncButtonStates();
}

document.getElementById('play1').addEventListener('click', startPressure);

document.getElementById('stop1').addEventListener('click', stopPressure);

document
  .getElementById('pressure-increase')
  .addEventListener('click', startPressureExtra);

document
  .getElementById('pressure-decrease')
  .addEventListener('click', stopPressureExtra);

document.getElementById('play2').addEventListener('click', startWind);

document.getElementById('stop2').addEventListener('click', stopWind);

document
  .getElementById('wind-increase')
  .addEventListener('click', startWindExtra);

document
  .getElementById('wind-decrease')
  .addEventListener('click', stopWindExtra);

document.getElementById('play3').addEventListener('click', startPrc);

document.getElementById('stop3').addEventListener('click', stopPrc);

const echoOnButton = document.getElementById('pressure-echo');
const echoOffButton = document.getElementById('wind-echo');

let echoEnabled = false;

function setEcho(enabled) {
  if (echoEnabled === enabled) {
    syncButtonStates();
    return;
  }

  echoEnabled = enabled;

  pressureEcho.wet.rampTo(enabled ? 0.4 : 0, 0.3);
  windEcho.wet.rampTo(enabled ? 0.4 : 0, 0.3);

  syncButtonStates();
}

setEcho(false);

echoOnButton.addEventListener('click', async () => {
  await ensureAudioStarted();
  setEcho(true);
});

echoOffButton.addEventListener('click', async () => {
  await ensureAudioStarted();
  setEcho(false);
});

const globalPrcPattern = {
  rain: [true, true, true, true, true, true, true, true],

  lightning: [true, false, true, true, false, true, true, true],

  thunder: [false, true, true, false, true, true, false, false]
};

function applyGlobalPrcPattern() {
  Object.keys(globalPrcPattern).forEach((instrument) => {
    prcSteps[instrument] = [...globalPrcPattern[instrument]];
  });

  document.querySelectorAll('.prc-row').forEach((row) => {
    const instrument = row.dataset.instrument;
    const cells = row.querySelectorAll('.prc-step');

    cells.forEach((cell, index) => {
      const active = prcSteps[instrument][index];

      cell.classList.toggle('is-active', active);
      cell.setAttribute('aria-pressed', String(active));
    });
  });
}

document.getElementById('play-all').addEventListener('click', async () => {
  await ensureAudioStarted();

  if (globalStopTimer !== null) {
    clearTimeout(globalStopTimer);
    globalStopTimer = null;
  }

  state.pressure.main = true;

  setVolumePreset(pressureMainVolume, 60, GLOBAL_FADE_IN);

  state.wind.main = true;

  setVolumePreset(windMainVolume, 40, GLOBAL_FADE_IN);

  state.wind.extra = true;

  setVolumePreset(windExtraVolume, 60, GLOBAL_FADE_IN);

  applyGlobalPrcPattern();

  prcPlaying = true;
  state.prc.playing = true;

  prcVolume.gain.rampTo(PRC_TARGET_VOLUME, GLOBAL_FADE_IN);

  setEcho(true);

  syncButtonStates();
});

document.getElementById('stop-all').addEventListener('click', () => {
  state.pressure.main = false;

  setLayerVolume(pressureMainVolume, false, GLOBAL_FADE_OUT);

  state.wind.main = false;
  state.wind.extra = false;

  setLayerVolume(windMainVolume, false, GLOBAL_FADE_OUT);

  setLayerVolume(windExtraVolume, false, GLOBAL_FADE_OUT);

  prcVolume.gain.rampTo(0, PRC_FADE_OUT);

  if (globalStopTimer !== null) {
    clearTimeout(globalStopTimer);
  }

  globalStopTimer = setTimeout(() => {
    prcPlaying = false;
    state.prc.playing = false;

    document.querySelectorAll('.prc-step').forEach((cell) => {
      cell.classList.remove('is-current');
    });

    globalStopTimer = null;
    syncButtonStates();
  }, PRC_FADE_OUT * 1000);

  setEcho(false);

  syncButtonStates();
});

function syncButtonStates() {
  const allMainLayers =
    state.pressure.main && state.wind.main && state.prc.playing;

  const buttons = [
    ['play1', state.pressure.main],
    ['pressure-increase', state.pressure.extra],

    ['play2', state.wind.main],
    ['wind-increase', state.wind.extra],

    ['play3', state.prc.playing],

    ['play-all', allMainLayers],

    ['pressure-echo', echoEnabled],
    ['wind-echo', !echoEnabled]
  ];

  buttons.forEach(([id, enabled]) => {
    const button = document.getElementById(id);

    button.classList.toggle('is-active', enabled);

    button.setAttribute('aria-pressed', String(enabled));
  });
}

syncButtonStates();

layerVolumes.forEach((volume, gain) => {
  const input = document.getElementById(volume.id);

  input.addEventListener('input', () => {
    volume.value = Number(input.value) / 100;

    updateVolumeMeter(volume);

    setLayerVolume(gain, state[volume.module][volume.layer], 0.03);
  });

  updateVolumeMeter(volume);
});
