import React, { useState, useEffect, useRef } from 'react'
import ScoreBoard from './components/ScoreBoard'
import Timer from './components/Timer'
import Settings from './components/Settings'
import Header from './components/Header'
import Footer from './components/Footer'

const DEFAULT_STATE = {
  score: { red: 0, blue: 0 },
  match: { remaining: 150, running: false, mode: 'auto', autoTime: 20, teleopTime: 130 },
  redActions: [
    { id: 1, name: '+2', points: 2, key: 'q' },
    { id: 2, name: '+3', points: 3, key: 'w' },
    { id: 3, name: '+5', points: 5, key: 'e' },
    { id: 4, name: 'Undo', points: -2, key: 'r' }
  ],
  blueActions: [
    { id: 5, name: '+2', points: 2, key: 'u' },
    { id: 6, name: '+3', points: 3, key: 'i' },
    { id: 7, name: '+5', points: 5, key: 'o' },
    { id: 8, name: 'Undo', points: -2, key: 'p' }
  ]
}

export default function App() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('scorekeeper')
      return saved ? JSON.parse(saved) : DEFAULT_STATE
    } catch {
      return DEFAULT_STATE
    }
  })
  
  const [showSettings, setShowSettings] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('scorekeeper', JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (!state.match.running) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      setState(prev => {
        const newState = { ...prev }
        newState.match = { ...prev.match }
        newState.match.remaining -= 1

        if (newState.match.mode === 'auto' && newState.match.remaining <= 0) {
          newState.match.mode = 'teleop'
          newState.match.remaining = newState.match.teleopTime || 130
        }

        if (newState.match.mode === 'teleop' && newState.match.remaining <= 0) {
          newState.match.running = false
        }

        return newState
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [state.match.running])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()

      state.redActions.forEach(action => {
        if (action.key.toLowerCase() === key) {
          setState(prev => ({
            ...prev,
            score: { ...prev.score, red: Math.max(0, prev.score.red + action.points) }
          }))
        }
      })

      state.blueActions.forEach(action => {
        if (action.key.toLowerCase() === key) {
          setState(prev => ({
            ...prev,
            score: { ...prev.score, blue: Math.max(0, prev.score.blue + action.points) }
          }))
        }
      })

      if (key === ' ') {
        e.preventDefault()
        setState(prev => ({ ...prev, match: { ...prev.match, running: !prev.match.running } }))
      }
      if (key === 'escape') {
        setState(prev => ({
          ...prev,
          match: {
            ...prev.match,
            running: false,
            mode: 'auto',
            remaining: prev.match.autoTime || 20
          }
        }))
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [state.redActions, state.blueActions])

  const addScore = (team, points) => {
    setState(prev => ({
      ...prev,
      score: { ...prev.score, [team]: prev.score[team] + points }
    }))
  }

  const startTimer = () => {
    setState(prev => ({ ...prev, match: { ...prev.match, running: true } }))
  }

  const pauseTimer = () => {
    setState(prev => ({ ...prev, match: { ...prev.match, running: false } }))
  }

  const skipToTeleop = () => {
    setState(prev => ({
      ...prev,
      match: {
        ...prev.match,
        running: false,
        mode: 'teleop',
        remaining: prev.match.teleopTime || 130
      }
    }))
  }

  const resetTimer = () => {
    setState(prev => ({
      ...prev,
      match: {
        ...prev.match,
        running: false,
        mode: 'auto',
        remaining: prev.match.autoTime || 20
      }
    }))
  }

  const updateSettings = (autoTime, teleopTime) => {
    setState(prev => ({
      ...prev,
      match: {
        ...prev.match,
        autoTime,
        teleopTime,
        running: false,
        mode: 'auto',
        remaining: autoTime
      }
    }))
  }

  const updateActions = (team, actions) => {
    setState(prev => ({
      ...prev,
      [team === 'red' ? 'redActions' : 'blueActions']: actions
    }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onSettingsClick={() => {
        setEditingTeam(null)
        setShowSettings(true)
      }} />
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <section className="scoreboard-display">
          <div className="scoreboard-top">
            <ScoreBoard
              team="red"
              score={state.score.red}
              actions={state.redActions}
              onAddScore={(points) => addScore('red', points)}
              onEditActions={() => {
                setEditingTeam('red')
                setShowSettings(true)
              }}
            />
            
            <Timer
              remaining={state.match.remaining}
              running={state.match.running}
              mode={state.match.mode}
              onStart={startTimer}
              onPause={pauseTimer}
              onSkipAuto={skipToTeleop}
              onReset={resetTimer}
            />
            
            <ScoreBoard
              team="blue"
              score={state.score.blue}
              actions={state.blueActions}
              onAddScore={(points) => addScore('blue', points)}
              onEditActions={() => {
                setEditingTeam('blue')
                setShowSettings(true)
              }}
            />
          </div>
        </section>
      </main>

      <Footer />

      {showSettings && (
        editingTeam ? (
          <Settings
            team={editingTeam}
            actions={editingTeam === 'red' ? state.redActions : state.blueActions}
            onSaveActions={(actions) => {
              updateActions(editingTeam, actions)
              setEditingTeam(null)
              setShowSettings(false)
            }}
            onClose={() => {
              setEditingTeam(null)
              setShowSettings(false)
            }}
          />
        ) : (
          <Settings
            autoTime={state.match.autoTime || 20}
            teleopTime={state.match.teleopTime || 130}
            onSaveSettings={(auto, teleop) => {
              updateSettings(auto, teleop)
              setShowSettings(false)
            }}
            onClose={() => setShowSettings(false)}
          />
        )
      )}
    </div>
  )
}
