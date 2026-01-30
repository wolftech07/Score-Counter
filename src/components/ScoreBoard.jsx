import React from 'react'

export default function ScoreBoard({ team, score, actions, onAddScore, onEditActions }) {
  return (
    <div className={`alliance ${team}`}>
      <div className="team-label">
        {team === 'red' ? 'Red' : 'Blue'}
        <button
          className="edit-actions-btn"
          onClick={onEditActions}
          title="Edit scoring actions"
          style={{
            background: 'none',
            border: 'none',
            color: '#aaa',
            cursor: 'pointer',
            fontSize: '14px',
            marginLeft: '8px'
          }}
        >
          ⚙️
        </button>
      </div>
      <div className="score-display">{score}</div>
      <div className="score-buttons">
        {actions.map(action => (
          <button
            key={action.id}
            className="btn-score"
            onClick={() => onAddScore(action.points)}
            title={`${action.name} (Press ${action.key.toUpperCase()})`}
          >
            {action.name}
          </button>
        ))}
      </div>
    </div>
  )
}
