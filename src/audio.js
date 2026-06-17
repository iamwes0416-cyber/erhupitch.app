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
