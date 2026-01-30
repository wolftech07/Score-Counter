// Simple keyboard-only score counter
const DEFAULT_STATE = {
  score: { red: 0, blue: 0 },
  match: { remaining: 150, running: false, mode: 'auto' }
}

function loadState(){
  try{const s=localStorage.getItem('scorekeeper'); return s?JSON.parse(s):DEFAULT_STATE}
  catch(e){console.error(e); return DEFAULT_STATE}
}

function saveState(state){ localStorage.setItem('scorekeeper', JSON.stringify(state)) }

let state = loadState()

const els = {
  totalRed: document.getElementById('total-red'),
  totalBlue: document.getElementById('total-blue'),
  timerDisplay: document.getElementById('timerDisplay'),
  timerModeDisplay: document.getElementById('timerModeDisplay'),
  timerStart: document.getElementById('timerStart'),
  timerPause: document.getElementById('timerPause'),
  toggleAutoBtn: document.getElementById('toggleAutoBtn')
}

function render() {
  if(els.totalRed) els.totalRed.textContent = state.score.red
  if(els.totalBlue) els.totalBlue.textContent = state.score.blue
}

function formatTime(sec) {
  sec = Math.max(0, Math.floor(sec))
  const mm = String(Math.floor(sec/60)).padStart(2,'0')
  const ss = String(sec%60).padStart(2,'0')
  return `${mm}:${ss}`
}

function updateTimerDisplay() {
  if(els.timerDisplay) els.timerDisplay.textContent = formatTime(state.match.remaining)
  if(els.timerModeDisplay) els.timerModeDisplay.textContent = state.match.mode === 'auto' ? 'Auto' : 'Teleop'
}

let timerInterval = null

function startTimer() {
  if(state.match.running) return
  state.match.running = true
  timerInterval = setInterval(() => {
    state.match.remaining -= 1
    
    // Auto to Teleop transition at 0
    if(state.match.mode === 'auto' && state.match.remaining <= 0) {
      state.match.mode = 'teleop'
      state.match.remaining = 130
    }
    
    // Match end
    if(state.match.mode === 'teleop' && state.match.remaining <= 0) {
      stopTimer()
    }
    
    updateTimerDisplay()
    saveState(state)
  }, 1000)
}

function stopTimer() {
  state.match.running = false
  if(timerInterval) clearInterval(timerInterval)
  timerInterval = null
  saveState(state)
}

function resetTimer() {
  stopTimer()
  state.match.mode = 'auto'
  state.match.remaining = 150
  updateTimerDisplay()
  saveState(state)
}

// Wire up timer buttons
if(els.timerStart) els.timerStart.addEventListener('click', startTimer)
if(els.timerPause) {
  els.timerPause.addEventListener('click', () => {
    if(state.match.running) stopTimer()
    else {
      state.match.mode = 'auto'
      state.match.remaining = 150
      startTimer()
    }
  })
}
if(els.toggleAutoBtn) {
  els.toggleAutoBtn.addEventListener('click', () => {
    stopTimer()
    state.match.mode = 'teleop'
    state.match.remaining = 130
    updateTimerDisplay()
    saveState(state)
  })
}

// Keyboard controls - simple and direct
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase()
  
  // Red team scoring
  if(key === 'q') { state.score.red += 2; render(); saveState(state); }
  if(key === 'w') { state.score.red += 3; render(); saveState(state); }
  if(key === 'e') { state.score.red += 5; render(); saveState(state); }
  if(key === 'r') { state.score.red = Math.max(0, state.score.red - 2); render(); saveState(state); }
  
  // Blue team scoring
  if(key === 'u') { state.score.blue += 2; render(); saveState(state); }
  if(key === 'i') { state.score.blue += 3; render(); saveState(state); }
  if(key === 'o') { state.score.blue += 5; render(); saveState(state); }
  if(key === 'p') { state.score.blue = Math.max(0, state.score.blue - 2); render(); saveState(state); }
  
  // Timer controls
  if(key === ' ') { e.preventDefault(); state.match.running ? stopTimer() : startTimer(); }
  if(key === 'escape') { resetTimer(); }
})

// Initialize
updateTimerDisplay()
render()
