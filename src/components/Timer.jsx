import React from 'react'

function formatTime(sec) {
  sec = Math.max(0, Math.floor(sec))
  const mm = String(Math.floor(sec / 60)).padStart(2, '0')
  const ss = String(sec % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export default function Timer({ remaining, running, mode, onStart, onPause, onSkipAuto, onReset }) {
  return (
    <div className="timer-section">
      <div className="timer-display">{formatTime(remaining)}</div>
      <div className="timer-mode">{mode === 'auto' ? 'Auto' : 'Teleop'}</div>
      <div className="timer-controls-inline">
        <button onClick={onStart} disabled={running}>Start</button>
        <button onClick={onPause} disabled={!running}>Pause</button>
        <button onClick={onSkipAuto} disabled={mode !== 'auto'}>Skip Auto</button>
        <button onClick={onReset}>Reset</button>
      </div>
    </div>
  )
}
