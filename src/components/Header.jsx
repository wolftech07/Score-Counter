import React from 'react'

export default function Header({ onSettingsClick }) {
  return (
    <header>
      <div className="header-top">
        <div className="header-section left">FIRST 2026 REBUILT</div>
        <div className="header-section center">
          Match <input type="number" placeholder="1" min="1" defaultValue="1" style={{ width: '40px' }} />
        </div>
        <div className="header-section right">Score Counter</div>
        <button className="settings-btn" onClick={onSettingsClick}>⚙️</button>
      </div>
    </header>
  )
}
