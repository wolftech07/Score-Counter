import React, { useState } from 'react'

export default function Settings({
  team,
  actions,
  autoTime,
  teleopTime,
  onSaveActions,
  onSaveSettings,
  onClose
}) {
  const [mode, setMode] = useState(team ? 'actions' : 'timer')
  const [localActions, setLocalActions] = useState(actions || [])
  const [auto, setAuto] = useState(autoTime)
  const [teleop, setTeleop] = useState(teleopTime)

  const handleActionChange = (id, field, value) => {
    setLocalActions(prev =>
      prev.map(action =>
        action.id === id ? { ...action, [field]: value } : action
      )
    )
  }

  const handleSaveActions = () => {
    onSaveActions(localActions)
  }

  const handleSaveSettings = () => {
    onSaveSettings(Number(auto), Number(teleop))
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {team ? `${team.charAt(0).toUpperCase() + team.slice(1)} Team Actions` : 'Timer Settings'}
          </h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {team ? (
          // Editing actions
          <div className="actions-editor">
            {localActions.map((action, idx) => (
              <div key={action.id} className="action-row">
                <div className="action-fields">
                  <input
                    type="text"
                    placeholder="Name (e.g., +2, Auto, Speaker)"
                    value={action.name}
                    onChange={(e) => handleActionChange(action.id, 'name', e.target.value)}
                    className="action-input"
                  />
                  <input
                    type="number"
                    placeholder="Points"
                    value={action.points}
                    onChange={(e) => handleActionChange(action.id, 'points', Number(e.target.value))}
                    className="action-input points-input"
                  />
                  <input
                    type="text"
                    placeholder="Key"
                    maxLength="1"
                    value={action.key}
                    onChange={(e) => handleActionChange(action.id, 'key', e.target.value.toLowerCase())}
                    className="action-input key-input"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Timer settings
          <>
            <div className="form-group">
              <label>Auto Time (seconds)</label>
              <input
                type="number"
                min="1"
                value={auto}
                onChange={(e) => setAuto(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Teleop Time (seconds)</label>
              <input
                type="number"
                min="1"
                value={teleop}
                onChange={(e) => setTeleop(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="btn-save"
            onClick={team ? handleSaveActions : handleSaveSettings}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
