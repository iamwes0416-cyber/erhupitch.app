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
          已收錄 D、G、C、B♭、F、A 六調完整指法。點擊音位發聲，長按持續，放手停止。
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MusicTool />);
