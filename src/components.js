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
    onStart(note, octave);
  };
  const handlePointerUp = (event) => {
    if (!event.isPrimary) return;
    onStop();
  };
  const handlePointerLeave = (event) => {
    if (!event.isPrimary) return;
    if (event.pointerType === 'mouse' && (event.buttons & 1) === 1) onStop();
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
      aria-label={`${ErhuHelpers.formatNoteName(note, preferFlats)}${octave}，簡譜 ${info?.number || ''}`}
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
      <div className="flex items-center gap-4">
        <img
          src="./whats二胡logo-方.png"
          alt="WH Logo"
          className="h-20 w-20 rounded-2xl border border-slate-100 object-cover shadow-sm"
        />
        <div className="min-w-0">
          <h3 className="text-2xl font-bold tracking-tight text-slate-800">WH 二胡｜您的二胡專家</h3>
          <p className="mt-1 text-lg font-semibold text-indigo-600">樂器販售 • 專業教學</p>
        </div>
      </div>

      <div className="grid gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-sm text-slate-600 shadow-inner sm:min-w-[320px]">
        <div className="grid grid-cols-[16px_1fr] items-center gap-2">
          <ClockIcon />
          <span>10:00–19:00（預約制）</span>
        </div>
        <a href="tel:0228813239" className="grid grid-cols-[16px_1fr] items-center gap-2 transition-colors hover:text-indigo-600">
          <PhoneIcon />
          <span>(02) 2881-3239</span>
        </a>
        <a href="https://maps.google.com/?q=台北市士林區承德路四段235號2樓" target="_blank" rel="noreferrer" className="grid grid-cols-[16px_1fr] items-start gap-2 transition-colors hover:text-indigo-600">
          <MapPinIcon />
          <span>台北市士林區承德路四段 235 號 2 樓</span>
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
    <h1 className="tool-heading-text">二胡音準養成工具</h1>
  </div>
);

const KeySelector = ({ rootNote, onRootNoteChange }) => (
  <label className="ml-auto flex flex-shrink-0 items-center gap-1.5">
    <span className="tool-heading-text text-sm sm:text-base">調性選擇</span>
    <select
      aria-label="選擇調性"
      value={rootNote}
      onChange={(event) => onRootNoteChange(event.target.value)}
      className="max-w-[116px] rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 sm:max-w-none sm:px-3 sm:text-sm"
    >
      {ErhuAppData.keys.map(key => (
        <option key={key.label} value={key.note}>
          {key.label}｜{key.desc}
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
      單次
    </button>
    <button
      type="button"
      onClick={() => onPlaybackModeChange('loop')}
      disabled={isPlaying}
      className={`rounded-md px-3 py-1.5 transition-colors disabled:opacity-50 ${playbackMode === 'loop' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
    >
      循環
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
      {isRecording ? '停止錄製' : '開始錄製'}
    </button>
    <button
      type="button"
      onClick={onPlayToggle}
      disabled={!recordedCount || isRecording}
      className="rounded-lg bg-indigo-500 px-2 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {isPlaying ? '停止播放' : '播放旋律'}
    </button>
    <button
      type="button"
      onClick={onClear}
      disabled={!recordedCount || isRecording}
      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
    >
      清除錄音
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
        <h2 className="text-base font-bold text-slate-700">旋律錄音</h2>
        <p className="mt-0.5 text-xs text-slate-400">
          {isRecording
            ? '正在錄製旋律...'
            : isPlaying
              ? '正在播放已錄製旋律'
              : recordedCount
                ? `已錄製 ${recordedCount} 個音`
                : '尚未錄製旋律'}
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
        <div className="absolute z-30 text-lg leading-none text-black" style={{ top: `${nutY - 27}px`, left: '50%', transform: 'translateX(-50%)' }}>空弦</div>
        <div className="absolute z-30 rounded bg-stone-800 px-3 py-1 text-sm font-bold text-white" style={{ left: `${innerX}px`, top: `${nutY - 68}px`, transform: 'translateX(-50%)' }}>內弦</div>
        <div className="absolute z-30 rounded bg-stone-800 px-3 py-1 text-sm font-bold text-white" style={{ left: `${outerX}px`, top: `${nutY - 68}px`, transform: 'translateX(-50%)' }}>外弦</div>

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
        二胡指板 (Fingerboard)
        <span className="ml-2 text-indigo-600">- {selectedKey.chartLabel || selectedKey.label} 調</span>
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
