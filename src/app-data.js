window.ErhuTheory = {
  notes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  flatNoteNames: {
    'C#': 'D♭',
    'D#': 'E♭',
    'F#': 'G♭',
    'G#': 'A♭',
    'A#': 'B♭'
  }
};

window.ErhuAppData = {
  strings: [
    { name: '內弦', baseNote: 'D', baseOctave: 4 },
    { name: '外弦', baseNote: 'A', baseOctave: 4 }
  ],
  board: {
    width: 350,
    innerX: 110,
    outerX: 240,
    nutY: 110,
    rowStep: 100,
    nutLineLeft: 35,
    nutLineWidth: 280
  },
  keys: [
    {
      label: 'D',
      note: 'D',
      desc: '1 - 5 弦',
      preferFlats: false,
      innerMax: 17,
      outerMax: 17,
      charts: {
        0: { startNumber: 1, startDot: 0, semitones: [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17] },
        1: { startNumber: 5, startDot: 0, semitones: [0, 2, 4, 5, 7, 9, 10, 12, 14, 16, 17] }
      }
    },
    {
      label: 'G',
      note: 'G',
      desc: '5̣ - 2 弦',
      preferFlats: false,
      innerMax: 17,
      outerMax: 17,
      charts: {
        0: { startNumber: 5, startDot: -1, semitones: [0, 2, 4, 5, 7, 9, 10, 12, 14, 16, 17] },
        1: { startNumber: 2, startDot: 0, semitones: [0, 2, 3, 5, 7, 9, 10, 12, 14, 15, 17] }
      }
    },
    {
      label: 'F',
      note: 'F',
      desc: '6̣ - 3 弦',
      preferFlats: true,
      innerMax: 17,
      outerMax: 17,
      charts: {
        0: { startNumber: 6, startDot: -1, semitones: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17] },
        1: { startNumber: 3, startDot: 0, semitones: [0, 1, 3, 5, 7, 8, 10, 12, 13, 15, 17] }
      }
    },
    {
      label: 'C',
      note: 'C',
      desc: '2 - 6 弦',
      preferFlats: false,
      innerMax: 17,
      outerMax: 17,
      noteNameOverrides: {
        '0:16': 'F',
        '1:16': 'C'
      },
      charts: {
        0: { startNumber: 2, startDot: 0, semitones: [0, 2, 3, 5, 7, 9, 10, 12, 14, 16, 17] },
        1: { startNumber: 6, startDot: 0, semitones: [0, 2, 3, 5, 7, 8, 10, 12, 14, 16, 17] }
      }
    },
    {
      label: 'B♭',
      chartLabel: '♭B',
      note: 'A#',
      desc: '3̣ - 7̣ 弦',
      preferFlats: true,
      innerMax: 17,
      outerMax: 17,
      charts: {
        0: { startNumber: 3, startDot: -1, semitones: [0, 2, 3, 5, 7, 8, 10, 12, 13, 15, 17] },
        1: { startNumber: 7, startDot: -1, semitones: [0, 1, 3, 5, 6, 8, 10, 12, 13, 15, 17] }
      }
    },
    {
      label: 'A',
      note: 'A',
      desc: '4̣ - 1 弦',
      preferFlats: false,
      innerMax: 19,
      outerMax: 19,
      charts: {
        0: { startNumber: 4, startDot: -1, semitones: [0, 2, 4, 6, 7, 9, 11, 12, 14, 16, 18, 19] },
        1: { startNumber: 1, startDot: 0, semitones: [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19] }
      }
    }
  ],
  toneProfile: {
    masterGain: 0.14,
    attack: 0.024,
    release: 0.08,
    bodyFilter: { type: 'lowpass', multiplier: 3.5, min: 980, max: 1680, q: 0.55 },
    presenceFilter: { type: 'peaking', frequency: 980, q: 1.1, gain: 2.2 },
    vibrato: { rate: 5.1, depth: 0.012, delay: 0.12 },
    bowNoise: { amount: 0.016, frequency: 1350, q: 0.85 },
    resonances: [
      { frequency: 760, q: 1.6, gain: 3.2 },
      { frequency: 1460, q: 1.2, gain: 1.8 }
    ],
    harmonics: [
      { ratio: 1, level: 0.62, type: 'sawtooth' },
      { ratio: 1, level: 0.22, type: 'triangle' },
      { ratio: 2, level: 0.10, type: 'sine' },
      { ratio: 3, level: 0.035, type: 'sine' }
    ]
  }
};

window.ErhuHelpers = {
  formatNoteName(note, preferFlats = false) {
    if (preferFlats && window.ErhuTheory.flatNoteNames[note]) {
      return window.ErhuTheory.flatNoteNames[note];
    }
    return note.replace('#', '♯');
  },

  getFrequency(note, octave) {
    const noteIndex = window.ErhuTheory.notes.indexOf(note);
    const semitonesFromC4 = (octave - 4) * 12 + noteIndex;
    const semitonesFromA4 = semitonesFromC4 - 9;
    return 442 * Math.pow(2, semitonesFromA4 / 12);
  },

  getChartEntry(selectedKey, stringIndex, semitone) {
    const chart = selectedKey.charts?.[stringIndex];
    if (!chart) return null;

    const sequenceIndex = chart.semitones.indexOf(semitone);
    if (sequenceIndex === -1) return null;

    const number = ((chart.startNumber - 1 + sequenceIndex) % 7) + 1;
    const dot = (chart.startDot || 0) + Math.floor((chart.startNumber - 1 + sequenceIndex) / 7);
    return {
      number: String(number),
      sequenceIndex,
      dot
    };
  },

  getJianpuInfo(selectedKey, stringIndex, semitone, note, noteOctave) {
    const chartEntry = this.getChartEntry(selectedKey, stringIndex, semitone);
    if (!chartEntry) return null;

    const overrideKey = `${stringIndex}:${semitone}`;

    return {
      number: chartEntry.number,
      dot: chartEntry.dot,
      displayNoteName: selectedKey.noteNameOverrides?.[overrideKey] || null
    };
  },

  createNoiseBuffer(ctx) {
    const sampleLength = Math.floor(ctx.sampleRate * 0.18);
    const buffer = ctx.createBuffer(1, sampleLength, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < sampleLength; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / sampleLength);
    }
    return buffer;
  }
};
