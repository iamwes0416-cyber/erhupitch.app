window.ErhuTheory = {
  notes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  flatNoteNames: {
    'C#': 'D??,
    'D#': 'E??,
    'F#': 'G??,
    'G#': 'A??,
    'A#': 'B??
  }
};

window.ErhuAppData = {
  strings: [
    { name: '?批憐', baseNote: 'D', baseOctave: 4 },
    { name: '憭憐', baseNote: 'A', baseOctave: 4 }
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
      desc: '1 - 5 撘?,
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
      desc: '5怗 - 2 撘?,
      preferFlats: false,
      innerMax: 17,
      outerMax: 17,
      charts: {
        0: { startNumber: 5, startDot: -1, semitones: [0, 2, 4, 5, 7, 9, 10, 12, 14, 16, 17] },
        1: { startNumber: 2, startDot: 0, semitones: [0, 2, 3, 5, 7, 9, 10, 12, 14, 15, 17] }
      }
    },
    {
      label: 'C',
      note: 'C',
      desc: '2 - 6 撘?,
      preferFlats: false,
      innerMax: 17,
      outerMax: 17,
      charts: {
        0: { startNumber: 2, startDot: 0, semitones: [0, 2, 3, 5, 7, 9, 10, 12, 14, 16, 17] },
        1: { startNumber: 6, startDot: 0, semitones: [0, 2, 3, 5, 7, 8, 10, 12, 14, 16, 17] }
      }
    },
    {
      label: 'B??,
      chartLabel: '?耑',
      note: 'A#',
      desc: '3怗 - 7怗 撘?,
      preferFlats: true,
      innerMax: 17,
      outerMax: 17,
      charts: {
        0: { startNumber: 3, startDot: -1, semitones: [0, 2, 3, 5, 7, 8, 10, 12, 13, 15, 17] },
        1: { startNumber: 7, startDot: -1, semitones: [0, 1, 3, 5, 6, 8, 10, 12, 13, 15, 17] }
      }
    },
    {
      label: 'F',
      note: 'F',
      desc: '6怗 - 3 撘?,
      preferFlats: true,
      innerMax: 17,
      outerMax: 17,
      charts: {
        0: { startNumber: 6, startDot: -1, semitones: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17] },
        1: { startNumber: 3, startDot: 0, semitones: [0, 1, 3, 5, 7, 8, 10, 12, 13, 15, 17] }
      }
    },
    {
      label: 'A',
      note: 'A',
      desc: '4怗 - 1 撘?,
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
    return note.replace('#', '??);
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

    return {
      number: chartEntry.number,
      dot: chartEntry.dot
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


const { useEffect, useRef, useState } = React;
const { getFrequency, createNoiseBuffer } = window.ErhuHelpers;

function useErhuAudio(profile) {
  const [activeNote, setActiveNote] = useState(null);
  const audioCtxRef = useRef(null);
  const activeSoundRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const stopTone = () => {
    if (!activeSoundRef.current) return;

    const ctx = audioCtxRef.current;
    const { oscillators, master, release, vibratoOscillator, bowNoiseSource } = activeSoundRef.current;

    try {
      const stopAt = ctx.currentTime + release;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.0001, stopAt);
      oscillators.forEach(oscillator => oscillator.stop(stopAt));
      if (vibratoOscillator) vibratoOscillator.stop(stopAt);
      if (bowNoiseSource) bowNoiseSource.stop(stopAt);
    } catch (error) {
      console.error('Audio stop error:', error);
    }

    activeSoundRef.current = null;
    setActiveNote(null);
  };

  const playTone = (note, octave) => {
    const ctx = initAudio();
    const frequency = getFrequency(note, octave);

    if (activeSoundRef.current) stopTone();

    const now = ctx.currentTime;
    const master = ctx.createGain();
    const bodyFilter = ctx.createBiquadFilter();
    const presenceFilter = ctx.createBiquadFilter();
    const oscillators = [];
    let vibratoOscillator = null;
    let bowNoiseSource = null;

    bodyFilter.type = profile.bodyFilter.type;
    bodyFilter.frequency.setValueAtTime(
      Math.min(profile.bodyFilter.max, Math.max(profile.bodyFilter.min, frequency * profile.bodyFilter.multiplier)),
      now
    );
    bodyFilter.Q.setValueAtTime(profile.bodyFilter.q, now);

    presenceFilter.type = profile.presenceFilter.type;
    presenceFilter.frequency.setValueAtTime(profile.presenceFilter.frequency, now);
    presenceFilter.Q.setValueAtTime(profile.presenceFilter.q, now);
    presenceFilter.gain.setValueAtTime(profile.presenceFilter.gain, now);

    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(profile.masterGain, now + profile.attack);

    profile.harmonics.forEach(({ ratio, level, type }) => {
      const oscillator = ctx.createOscillator();
      const harmonicGain = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency * ratio, now);
      harmonicGain.gain.setValueAtTime(level, now);
      oscillator.connect(harmonicGain);
      harmonicGain.connect(bodyFilter);
      oscillator.start(now);
      oscillators.push(oscillator);
    });

    profile.resonances.forEach(({ frequency: resonanceFrequency, q, gain }) => {
      const resonance = ctx.createBiquadFilter();
      resonance.type = 'peaking';
      resonance.frequency.setValueAtTime(resonanceFrequency, now);
      resonance.Q.setValueAtTime(q, now);
      resonance.gain.setValueAtTime(gain, now);
      bodyFilter.connect(resonance);
      resonance.connect(presenceFilter);
    });

    if (!profile.resonances.length) {
      bodyFilter.connect(presenceFilter);
    }

    if (profile.vibrato) {
      const vibratoDepth = ctx.createGain();
      vibratoOscillator = ctx.createOscillator();
      vibratoOscillator.type = 'sine';
      vibratoOscillator.frequency.setValueAtTime(profile.vibrato.rate, now);
      vibratoDepth.gain.setValueAtTime(0.0001, now);
      vibratoDepth.gain.linearRampToValueAtTime(frequency * profile.vibrato.depth, now + profile.vibrato.delay);
      vibratoOscillator.connect(vibratoDepth);
      oscillators.forEach(oscillator => vibratoDepth.connect(oscillator.frequency));
      vibratoOscillator.start(now);
    }

    if (profile.bowNoise) {
      const noiseFilter = ctx.createBiquadFilter();
      const noiseGain = ctx.createGain();
      bowNoiseSource = ctx.createBufferSource();
      bowNoiseSource.buffer = createNoiseBuffer(ctx);
      bowNoiseSource.loop = true;

      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(profile.bowNoise.frequency, now);
      noiseFilter.Q.setValueAtTime(profile.bowNoise.q, now);
      noiseGain.gain.setValueAtTime(profile.bowNoise.amount, now);

      bowNoiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(presenceFilter);
      bowNoiseSource.start(now);
    }

    presenceFilter.connect(master);
    master.connect(ctx.destination);

    activeSoundRef.current = {
      oscillators,
      master,
      release: profile.release,
      vibratoOscillator,
      bowNoiseSource
    };

    setActiveNote({ note, octave });
  };

  useEffect(() => () => stopTone(), []);

  return { activeNote, playTone, stopTone };
}

window.ErhuAudio = { useErhuAudio };


const { useEffect: useRecorderEffect, useRef: useRecorderRef, useState: useRecorderState } = React;

function useMelodyRecorder(playTone, stopTone) {
  const [isRecording, setIsRecording] = useRecorderState(false);
  const [isPlaying, setIsPlaying] = useRecorderState(false);
  const [recordedMelody, setRecordedMelody] = useRecorderState([]);
  const [playbackMode, setPlaybackMode] = useRecorderState('once');

  const recordingStartedAtRef = useRecorderRef(null);
  const noteStartAtRef = useRecorderRef(null);
  const pendingNoteRef = useRecorderRef(null);
  const activePointerIdRef = useRecorderRef(null);
  const lastAcceptedStartRef = useRecorderRef(null);
  const playbackTimeoutsRef = useRecorderRef([]);
  const playbackShouldLoopRef = useRecorderRef(false);

  const clearPlaybackTimers = () => {
    playbackTimeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    playbackTimeoutsRef.current = [];
  };

  const finishPendingRecordedNote = () => {
    if (!isRecording || !pendingNoteRef.current || noteStartAtRef.current === null) return;

    const duration = Math.max(120, Date.now() - noteStartAtRef.current);
    setRecordedMelody(currentMelody => currentMelody.map((item, index) => (
      index === currentMelody.length - 1 ? { ...item, duration } : item
    )));

    pendingNoteRef.current = null;
    noteStartAtRef.current = null;
  };

  const handleNoteStart = (note, octave, pointerId = null) => {
    const now = Date.now();
    const lastAcceptedStart = lastAcceptedStartRef.current;

    if (
      lastAcceptedStart &&
      lastAcceptedStart.note === note &&
      lastAcceptedStart.octave === octave &&
      now - lastAcceptedStart.at < 140
    ) {
      return;
    }

    if (activePointerIdRef.current !== null && pointerId !== null && activePointerIdRef.current === pointerId) {
      return;
    }

    playTone(note, octave);
    activePointerIdRef.current = pointerId;
    lastAcceptedStartRef.current = { note, octave, at: now };

    if (!isRecording) return;

    finishPendingRecordedNote();

    const startedAt = recordingStartedAtRef.current ?? now;
    const noteEntry = {
      note,
      octave,
      startOffset: now - startedAt,
      duration: 240
    };

    pendingNoteRef.current = noteEntry;
    noteStartAtRef.current = now;
    setRecordedMelody(currentMelody => [...currentMelody, noteEntry]);
  };

  const handleNoteStop = (pointerId = null) => {
    if (
      pointerId !== null &&
      activePointerIdRef.current !== null &&
      pointerId !== activePointerIdRef.current
    ) {
      return;
    }

    activePointerIdRef.current = null;
    stopTone();
    finishPendingRecordedNote();
  };

  const startRecording = () => {
    clearPlaybackTimers();
    stopTone();
    setRecordedMelody([]);
    setIsPlaying(false);
    setIsRecording(true);
    recordingStartedAtRef.current = Date.now();
    noteStartAtRef.current = null;
    pendingNoteRef.current = null;
    activePointerIdRef.current = null;
    lastAcceptedStartRef.current = null;
  };

  const stopRecording = () => {
    finishPendingRecordedNote();
    setIsRecording(false);
    recordingStartedAtRef.current = null;
    activePointerIdRef.current = null;
  };

  const stopPlayback = () => {
    playbackShouldLoopRef.current = false;
    clearPlaybackTimers();
    stopTone();
    setIsPlaying(false);
    activePointerIdRef.current = null;
  };

  const schedulePlaybackCycle = () => {
    if (!recordedMelody.length) return;

    const cycleLength = recordedMelody.reduce((maxEnd, item) => Math.max(maxEnd, item.startOffset + item.duration), 0);

    recordedMelody.forEach(item => {
      const startTimer = window.setTimeout(() => {
        playTone(item.note, item.octave);
      }, item.startOffset);

      const stopTimer = window.setTimeout(() => {
        stopTone();
      }, item.startOffset + item.duration);

      playbackTimeoutsRef.current.push(startTimer, stopTimer);
    });

    const endTimer = window.setTimeout(() => {
      if (playbackShouldLoopRef.current) {
        schedulePlaybackCycle();
        return;
      }
      stopTone();
      setIsPlaying(false);
    }, cycleLength + 80);

    playbackTimeoutsRef.current.push(endTimer);
  };

  const playRecordedMelody = () => {
    if (!recordedMelody.length) return;

    clearPlaybackTimers();
    stopTone();
    setIsRecording(false);
    setIsPlaying(true);
    playbackShouldLoopRef.current = playbackMode === 'loop';
    schedulePlaybackCycle();
  };

  const clearRecording = () => {
    stopPlayback();
    setIsRecording(false);
    setRecordedMelody([]);
    recordingStartedAtRef.current = null;
    noteStartAtRef.current = null;
    pendingNoteRef.current = null;
    activePointerIdRef.current = null;
    lastAcceptedStartRef.current = null;
  };

  useRecorderEffect(() => () => {
    clearPlaybackTimers();
    stopTone();
  }, []);

  return {
    isRecording,
    isPlaying,
    recordedMelody,
    playbackMode,
    setPlaybackMode,
    handleNoteStart,
    handleNoteStop,
    startRecording,
    stopRecording,
    stopPlayback,
    playRecordedMelody,
    clearRecording
  };
}

window.ErhuRecorder = { useMelodyRecorder };


const { ErhuAppData, ErhuHelpers, ErhuTheory } = window;

const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const LineIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>;
const FbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const YoutubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>;
const MusicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;

const OctaveDots = ({ dot }) => {
  if (!dot) return null;

  const dotCount = Math.abs(dot);
  const isUpper = dot > 0;

  return (
    <div
      className={`jianpu-dot-row ${isUpper ? 'upper' : 'lower'} ${dotCount === 1 ? 'single' : 'double'}`}
    >
      {Array.from({ length: dotCount }).map((_, index) => (
        <span key={`${dot}-${index}`} />
      ))}
    </div>
  );
};

const FingerNote = ({ note, octave, preferFlats, info, activeNote, onStart, onStop, x, y }) => {
  const isActive = activeNote?.note === note && activeNote?.octave === octave;
  const handlePointerDown = (event) => {
    if (!event.isPrimary) return;
    event.preventDefault();
    onStart(note, octave, event.pointerId);
  };
  const handlePointerUp = (event) => {
    if (!event.isPrimary) return;
    onStop(event.pointerId);
  };
  const handlePointerLeave = (event) => {
    if (!event.isPrimary) return;
    if (event.pointerType === 'mouse' && (event.buttons & 1) === 1) onStop(event.pointerId);
  };

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      className={`absolute z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 shadow-sm transition-all duration-150 ${
        isActive ? 'scale-100 border-blue-600 bg-blue-500 text-white shadow-lg' : 'border-stone-300 bg-white text-slate-700 hover:border-blue-300'
      }`}
      style={{ left: `${x}px`, top: `${y}px`, touchAction: 'none' }}
      aria-label={`${ErhuHelpers.formatNoteName(note, preferFlats)}${octave}嚗陛霅?${info?.number || ''}`}
    >
      <OctaveDots dot={info?.dot || 0} />
      <span className={`jianpu-number leading-none ${isActive ? 'text-xl font-bold' : 'text-[15px] font-bold text-slate-800'}`}>{info?.number || ''}</span>
      <span className={`note-name ${isActive ? 'text-[9px] text-blue-100' : 'text-[10px] text-slate-500'}`}>{ErhuHelpers.formatNoteName(note, preferFlats)}{octave}</span>
    </button>
  );
};

const BusinessCard = () => (
  <div className="mobile-business-card mb-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg md:p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        <img
          src="./whats鈭logo-??png"
          alt="WH Logo"
          className="h-16 w-16 rounded-2xl border border-slate-100 object-cover shadow-sm sm:h-20 sm:w-20"
        />
        <div className="min-w-0">
          <h3 className="whitespace-nowrap text-[1.1rem] font-bold leading-tight tracking-tight text-slate-800 sm:text-2xl">WH 鈭嚚???∪?摰?/h3>
          <p className="mt-1 text-base font-semibold text-indigo-600 sm:text-lg">璅鞎拙 ??撠平?飛</p>
        </div>
      </div>

      <div className="grid gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-sm text-slate-600 shadow-inner sm:min-w-[320px]">
        <div className="grid grid-cols-[16px_1fr] items-center gap-2">
          <ClockIcon />
          <span>10:00??9:00嚗?蝝嚗?/span>
        </div>
        <a href="tel:0228813239" className="grid grid-cols-[16px_1fr] items-center gap-2 transition-colors hover:text-indigo-600">
          <PhoneIcon />
          <span>(02) 2881-3239</span>
        </a>
        <a href="https://maps.google.com/?q=?啣?撣ㄚ???踹噸頝臬?畾?35??璅? target="_blank" rel="noreferrer" className="grid grid-cols-[16px_1fr] items-start gap-2 transition-colors hover:text-indigo-600">
          <MapPinIcon />
          <span>?啣?撣ㄚ???踹噸頝臬?畾?235 ??2 璅?/span>
        </a>
      </div>
    </div>

    <div className="mt-4 flex w-full gap-2 md:gap-3">
      <a href="https://lin.ee/YDerWnQ" target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1 rounded-full bg-[#06C755] px-3 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#05b64d] md:gap-2 md:px-5 md:text-base">
        <LineIcon /> <span className="hidden sm:inline">LINE</span>
      </a>
      <a href="https://www.facebook.com/qwtwherhu/" target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1 rounded-full bg-[#1877F2] px-3 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#166fe5] md:gap-2 md:px-5 md:text-base">
        <FbIcon /> <span className="hidden sm:inline">FB</span>
      </a>
      <a href="https://www.youtube.com/@wherhu" target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1 rounded-full bg-[#FF0000] px-3 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#CC0000] md:gap-2 md:px-5 md:text-base">
        <YoutubeIcon /> <span className="hidden sm:inline">YT</span>
      </a>
    </div>
  </div>
);

const SectionTitle = () => (
  <div className="flex min-w-0 items-center gap-2 md:gap-3">
    <div className="text-indigo-600">
      <MusicIcon />
    </div>
    <h1 className="tool-heading-text">鈭?單?擗?撌亙</h1>
  </div>
);

const KeySelector = ({ rootNote, onRootNoteChange }) => (
  <label className="ml-auto flex flex-shrink-0 items-center gap-1.5">
    <span className="tool-heading-text text-sm sm:text-base">隤踵折??/span>
    <select
      aria-label="?豢?隤踵?
      value={rootNote}
      onChange={(event) => onRootNoteChange(event.target.value)}
      className="max-w-[116px] rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 sm:max-w-none sm:px-3 sm:text-sm"
    >
      {ErhuAppData.keys.map(key => (
        <option key={key.label} value={key.note}>
          {key.label}嚚key.desc}
        </option>
      ))}
    </select>
  </label>
);

const ToolHeader = ({ rootNote, onRootNoteChange }) => (
  <div className="mobile-tool-row mb-3 flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm md:px-4 md:py-3">
    <SectionTitle />
    <KeySelector rootNote={rootNote} onRootNoteChange={onRootNoteChange} />
  </div>
);

const PlaybackModeToggle = ({ playbackMode, isPlaying, onPlaybackModeChange }) => (
  <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-bold">
    <button
      type="button"
      onClick={() => onPlaybackModeChange('once')}
      disabled={isPlaying}
      className={`rounded-md px-3 py-1.5 transition-colors disabled:opacity-50 ${playbackMode === 'once' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
    >
      ?格活
    </button>
    <button
      type="button"
      onClick={() => onPlaybackModeChange('loop')}
      disabled={isPlaying}
      className={`rounded-md px-3 py-1.5 transition-colors disabled:opacity-50 ${playbackMode === 'loop' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
    >
      敺芰
    </button>
  </div>
);

const RecorderActions = ({ isRecording, isPlaying, recordedCount, onRecordToggle, onPlayToggle, onClear }) => (
  <div className="grid grid-cols-4 gap-2">
    <button
      type="button"
      onClick={onRecordToggle}
      disabled={isPlaying}
      className={`rounded-lg px-2 py-2.5 text-xs font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40 ${isRecording ? 'bg-slate-700' : 'bg-red-500 hover:bg-red-600'}`}
    >
      {isRecording ? '?迫?ˊ' : '???ˊ'}
    </button>
    <button
      type="button"
      onClick={onPlayToggle}
      disabled={!recordedCount || isRecording}
      className="rounded-lg bg-indigo-500 px-2 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {isPlaying ? '?迫?剜' : '?剜??'}
    </button>
    <button
      type="button"
      onClick={onClear}
      disabled={!recordedCount || isRecording}
      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
    >
      皜?
    </button>
    <div className="flex flex-col items-center justify-center rounded-lg border border-amber-100 bg-amber-50/70 px-2 py-2 text-center">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-500">Notes</span>
      <span className="text-sm font-bold text-amber-700">{recordedCount}</span>
    </div>
  </div>
);

const RecorderPanel = ({
  isRecording,
  isPlaying,
  recordedCount,
  playbackMode,
  onPlaybackModeChange,
  onRecordToggle,
  onPlayToggle,
  onClear
}) => (
  <div className="mb-4 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-bold text-slate-700">???</h2>
        <p className="mt-0.5 text-xs text-slate-400">
          {isRecording
            ? '甇??ˊ??...'
            : isPlaying
              ? '甇??剜撌脤?鋆賣?敺?
              : recordedCount
                ? `撌脤?鋆?${recordedCount} ?`
                : '撠?ˊ??'}
        </p>
      </div>
      {isRecording ? (
        <span className="flex items-center gap-1.5 text-xs font-bold text-red-600">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
          REC
        </span>
      ) : (
        <PlaybackModeToggle playbackMode={playbackMode} isPlaying={isPlaying} onPlaybackModeChange={onPlaybackModeChange} />
      )}
    </div>
    <RecorderActions
      isRecording={isRecording}
      isPlaying={isPlaying}
      recordedCount={recordedCount}
      onRecordToggle={onRecordToggle}
      onPlayToggle={onPlayToggle}
      onClear={onClear}
    />
  </div>
);

const ErhuBoard = ({ rootNote, selectedKey, activeNote, onStartTone, onStopTone }) => {
  const { width, innerX, outerX, nutY, rowStep, nutLineLeft, nutLineWidth } = ErhuAppData.board;
  const positionForSemitone = semitone => semitone * (rowStep / 2);
  const lastNoteLinePosition = Math.ceil(Math.max(selectedKey.innerMax, selectedKey.outerMax) / 2);
  const horizontalLinePositions = Array.from({ length: lastNoteLinePosition }, (_, index) => index + 1);
  const boardHeight = nutY + lastNoteLinePosition * rowStep + 52;

  const renderNote = (key, stringIndex, semitone, x) => {
    const string = ErhuAppData.strings[stringIndex];
    const baseIndex = ErhuTheory.notes.indexOf(string.baseNote);
    const note = ErhuTheory.notes[(baseIndex + semitone) % 12];
    const octave = string.baseOctave + Math.floor((baseIndex + semitone) / 12);
    const info = ErhuHelpers.getJianpuInfo(selectedKey, stringIndex, semitone, note, octave);
    if (!info) return null;

    return (
      <FingerNote
        key={key}
        note={note}
        octave={octave}
        preferFlats={selectedKey.preferFlats}
        info={info}
        activeNote={activeNote}
        onStart={onStartTone}
        onStop={onStopTone}
        x={x}
        y={nutY + positionForSemitone(semitone)}
      />
    );
  };

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
      <div className="relative mx-auto select-none origin-top" style={{ width: `${width}px`, height: `${boardHeight}px` }}>
        <div className="absolute z-30 text-lg leading-none text-black" style={{ top: `${nutY - 27}px`, left: '50%', transform: 'translateX(-50%)' }}>蝛箏憐</div>
        <div className="absolute z-30 rounded bg-stone-800 px-3 py-1 text-sm font-bold text-white" style={{ left: `${innerX}px`, top: `${nutY - 68}px`, transform: 'translateX(-50%)' }}>?批憐</div>
        <div className="absolute z-30 rounded bg-stone-800 px-3 py-1 text-sm font-bold text-white" style={{ left: `${outerX}px`, top: `${nutY - 68}px`, transform: 'translateX(-50%)' }}>憭憐</div>

        <div className="absolute bg-black" style={{ left: `${innerX - 4}px`, top: `${nutY - 30}px`, width: '8px', height: `${boardHeight - nutY + 26}px` }} />
        <div className="absolute bg-black" style={{ left: `${outerX - 4}px`, top: `${nutY - 30}px`, width: '8px', height: `${boardHeight - nutY + 26}px` }} />
        <div className="absolute bg-black" style={{ left: `${nutLineLeft}px`, top: `${nutY - 4}px`, width: `${nutLineWidth}px`, height: '8px' }} />

        {horizontalLinePositions.map(position => (
          <div
            key={`grid-${position}`}
            className="absolute bg-black"
            style={{ left: `${innerX}px`, top: `${nutY + position * rowStep - 3}px`, width: `${outerX - innerX}px`, height: '6px' }}
          />
        ))}

        {renderNote('inner-open', 0, 0, innerX)}
        {renderNote('outer-open', 1, 0, outerX)}
        {Array.from({ length: selectedKey.innerMax }, (_, index) => renderNote(`inner-${index + 1}`, 0, index + 1, innerX))}
        {Array.from({ length: selectedKey.outerMax }, (_, index) => renderNote(`outer-${index + 1}`, 1, index + 1, outerX))}
      </div>
    </div>
  );
};

const BoardPanel = ({ selectedKey, activeNote, onStartTone, onStopTone }) => (
  <div className="mobile-board-card min-h-[400px] rounded-2xl border border-slate-100 bg-white p-4 shadow-lg md:p-6">
    <div className="mobile-board-heading mb-3 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-2">
      <h2 className="text-base font-bold text-slate-700">
        鈭? (Fingerboard)
        <span className="ml-2 text-indigo-600">- {selectedKey.chartLabel || selectedKey.label} 隤?/span>
      </h2>
    </div>
    <div className="flex w-full justify-center">
      <ErhuBoard
        rootNote={selectedKey.note}
        selectedKey={selectedKey}
        activeNote={activeNote}
        onStartTone={onStartTone}
        onStopTone={onStopTone}
      />
    </div>
  </div>
);

window.ErhuComponents = {
  BusinessCard,
  ToolHeader,
  RecorderPanel,
  BoardPanel
};


const { useState } = React;
const { useErhuAudio } = window.ErhuAudio;
const { useMelodyRecorder } = window.ErhuRecorder;
const { BusinessCard, ToolHeader, RecorderPanel, BoardPanel } = window.ErhuComponents;

function MusicTool() {
  const [rootNote, setRootNote] = useState('D');
  const selectedKey = window.ErhuAppData.keys.find(key => key.note === rootNote) || window.ErhuAppData.keys[0];
  const { activeNote, playTone, stopTone } = useErhuAudio(window.ErhuAppData.toneProfile);
  const recorder = useMelodyRecorder(playTone, stopTone);

  return (
    <div className="min-h-screen bg-slate-50 pb-10 font-sans text-slate-800">
      <div className="mobile-app-shell mx-auto max-w-4xl p-3 md:p-4">
        <BusinessCard />
        <ToolHeader rootNote={rootNote} onRootNoteChange={setRootNote} />
        <RecorderPanel
          isRecording={recorder.isRecording}
          isPlaying={recorder.isPlaying}
          recordedCount={recorder.recordedMelody.length}
          playbackMode={recorder.playbackMode}
          onPlaybackModeChange={recorder.setPlaybackMode}
          onRecordToggle={recorder.isRecording ? recorder.stopRecording : recorder.startRecording}
          onPlayToggle={recorder.isPlaying ? recorder.stopPlayback : recorder.playRecordedMelody}
          onClear={recorder.clearRecording}
        />
        <BoardPanel
          selectedKey={selectedKey}
          activeNote={activeNote}
          onStartTone={recorder.handleNoteStart}
          onStopTone={recorder.handleNoteStop}
        />
        <div className="mobile-footer mt-8 text-center text-sm text-slate-400">
          撌脫??D????准? ?剛矽摰?????雿?莎??瑟???嚗??甇Ｕ?        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MusicTool />);
