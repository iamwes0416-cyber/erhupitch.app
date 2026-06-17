const { useEffect: useRecorderEffect, useRef: useRecorderRef, useState: useRecorderState } = React;

function useMelodyRecorder(playTone, stopTone) {
  const [isRecording, setIsRecording] = useRecorderState(false);
  const [isPlaying, setIsPlaying] = useRecorderState(false);
  const [recordedMelody, setRecordedMelody] = useRecorderState([]);
  const [playbackMode, setPlaybackMode] = useRecorderState('once');

  const recordingStartedAtRef = useRecorderRef(null);
  const noteStartAtRef = useRecorderRef(null);
  const pendingNoteRef = useRecorderRef(null);
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

  const handleNoteStart = (note, octave) => {
    playTone(note, octave);

    if (!isRecording) return;

    finishPendingRecordedNote();

    const now = Date.now();
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

  const handleNoteStop = () => {
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
  };

  const stopRecording = () => {
    finishPendingRecordedNote();
    setIsRecording(false);
    recordingStartedAtRef.current = null;
  };

  const stopPlayback = () => {
    playbackShouldLoopRef.current = false;
    clearPlaybackTimers();
    stopTone();
    setIsPlaying(false);
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
