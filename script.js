// Simple keyboard-only score counter
const DEFAULT_STATE = {
  score: { red: 0, blue: 0 },
  match: { remaining: 150, running: false, mode: 'auto', autoTime: 20, teleopTime: 130 }
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
  toggleAutoBtn: document.getElementById('toggleAutoBtn'),
  settingsBtn: document.getElementById('settingsBtn'),
  settingsModal: document.getElementById('settingsModal'),
  closeSettings: document.getElementById('closeSettings'),
  settingsAutoTime: document.getElementById('settingsAutoTime'),
  settingsTeleopTime: document.getElementById('settingsTeleopTime'),
  saveSettings: document.getElementById('saveSettings'),
  cancelSettings: document.getElementById('cancelSettings'),
  // Score buttons
  red2: document.getElementById('red-2'),
  red3: document.getElementById('red-3'),
  red5: document.getElementById('red-5'),
  redUndo: document.getElementById('red-undo'),
  blue2: document.getElementById('blue-2'),
  blue3: document.getElementById('blue-3'),
  blue5: document.getElementById('blue-5'),
  blueUndo: document.getElementById('blue-undo')
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
}

function resetTimer() {
  stopTimer()
  state.match.mode = 'auto'
  state.match.remaining = state.match.autoTime || 150
  updateTimerDisplay()
  saveState(state)
}

// Settings modal functions
function openSettings() {
  if(els.settingsAutoTime) els.settingsAutoTime.value = state.match.autoTime || 20
  if(els.settingsTeleopTime) els.settingsTeleopTime.value = state.match.teleopTime || 130
  if(els.settingsModal) els.settingsModal.style.display = 'flex'
}

function closeSettings() {
  if(els.settingsModal) els.settingsModal.style.display = 'none'
}

// Wire up settings button and modal
if(els.settingsBtn) els.settingsBtn.addEventListener('click', openSettings)
if(els.closeSettings) els.closeSettings.addEventListener('click', closeSettings)
if(els.cancelSettings) els.cancelSettings.addEventListener('click', closeSettings)
if(els.saveSettings) {
  els.saveSettings.addEventListener('click', () => {
    const autoTime = Number(els.settingsAutoTime?.value || 20)
    const teleopTime = Number(els.settingsTeleopTime?.value || 130)
    state.match.autoTime = autoTime
    state.match.teleopTime = teleopTime
    state.match.remaining = autoTime
    state.match.mode = 'auto'
    stopTimer()
    updateTimerDisplay()
    saveState(state)
    closeSettings()
  })
}
if(els.settingsModal) {
  els.settingsModal.addEventListener('click', (e) => {
    if(e.target === els.settingsModal) closeSettings()
  })
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

// Wire up score buttons
if(els.red2) els.red2.addEventListener('click', () => { state.score.red += 2; render(); saveState(state); })
if(els.red3) els.red3.addEventListener('click', () => { state.score.red += 3; render(); saveState(state); })
if(els.red5) els.red5.addEventListener('click', () => { state.score.red += 5; render(); saveState(state); })
if(els.redUndo) els.redUndo.addEventListener('click', () => { state.score.red = Math.max(0, state.score.red - 2); render(); saveState(state); })

if(els.blue2) els.blue2.addEventListener('click', () => { state.score.blue += 2; render(); saveState(state); })
if(els.blue3) els.blue3.addEventListener('click', () => { state.score.blue += 3; render(); saveState(state); })
if(els.blue5) els.blue5.addEventListener('click', () => { state.score.blue += 5; render(); saveState(state); })
if(els.blueUndo) els.blueUndo.addEventListener('click', () => { state.score.blue = Math.max(0, state.score.blue - 2); render(); saveState(state); })

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
