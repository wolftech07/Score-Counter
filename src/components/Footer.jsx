import React from 'react'

export default function Footer() {
  return (
    <footer>
      <div className="keyboard-legend">
        <div className="legend-row">
          <div className="legend-item"><strong>Red:</strong> Q(+2) W(+3) E(+5) R(Undo)</div>
          <div className="legend-item"><strong>Blue:</strong> U(+2) I(+3) O(+5) P(Undo)</div>
        </div>
        <div className="legend-row">
          <div className="legend-item"><strong>Timer:</strong> SPACE(Start/Stop) ESC(Reset)</div>
        </div>
      </div>
    </footer>
  )
}
