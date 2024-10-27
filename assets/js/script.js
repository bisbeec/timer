const startButton = document.getElementById('start');
const timeDisplay = document.getElementById('time');
const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;


circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

let timerDuration = 1 * 60; // Default timer duration (1 minute)
let shortBreakDuration = 3 * 60; // Default short break duration (3 minutes)
let longBreakDuration = 8 * 60; // Default long break duration (8 minutes)
let timeRemaining = timerDuration; // Tracks time remaining
let startTime; // Tracks start time
let endTime; // Tracks end time
let isRunning = false; // Tracks whether the timer is running or paused
let duration = timerDuration; // Initialize the duration for the "Timer" mode
let animationFrameId; // RequestAnimationFrame ID

// Function to set the progress of the circular bar
function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

// Function to update the display of the timer
function updateDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const percent = (timeRemaining / duration) * 100;
  setProgress(percent);
}

// Function to animate the timer using requestAnimationFrame
function animateTimer() {
  const currentTime = Date.now();
  timeRemaining = Math.max(0, Math.floor((endTime - currentTime) / 1000));
  updateDisplay();

  // Check if time has run out
  if (timeRemaining > 0) {
    animationFrameId = requestAnimationFrame(animateTimer); // Continue animation
  } else {
    cancelAnimationFrame(animationFrameId); // Stop animation
    isRunning = false;
    startButton.textContent = 'Start'; // Reset to Start when time is up
  }
}

// Start the timer
function startTimer() {
  startTime = Date.now();
  endTime = startTime + timeRemaining * 1000;

  if (!isRunning) {
    animateTimer(); // Start the animation loop
  }
}

// Pause the timer
function pauseTimer() {
  cancelAnimationFrame(animationFrameId); // Stop the animation loop
}

// Start/Pause button functionality
startButton.addEventListener('click', () => {
  if (!isRunning) {
    startTimer();
    startButton.innerHTML = '<span>Pause</span>';
  } else {
    pauseTimer();
    startButton.innerHTML = '<span>Start</span>';
  }
  isRunning = !isRunning;
});

// Mode Buttons: Timer, Short Break, Long Break
const timerBtn = document.getElementById('timer-btn');
const shortBreakBtn = document.getElementById('short-break-btn');
const longBreakBtn = document.getElementById('long-break-btn');
const modeButtons = [timerBtn, shortBreakBtn, longBreakBtn];

// Set mode and reset timer when a mode is selected
function setMode(newDuration, activeButton) {
  pauseTimer();
  isRunning = false;

  duration = newDuration;
  timeRemaining = duration;
  updateDisplay();
  setProgress(100); // Ensure full circle is visible
  startButton.innerHTML = '<span>Start</span>';

  // Update the active button state
  modeButtons.forEach(button => button.classList.remove('active'));
  activeButton.classList.add('active');
}

// Event listeners for mode buttons
timerBtn.addEventListener('click', () => setMode(timerDuration, timerBtn));
shortBreakBtn.addEventListener('click', () => setMode(shortBreakDuration, shortBreakBtn));
longBreakBtn.addEventListener('click', () => setMode(longBreakDuration, longBreakBtn));

// Settings Modal and Save functionality
const settingsBtn = document.getElementById('settings-btn');
const modal = document.getElementById('settings-modal');
const saveSettingsBtn = document.getElementById('save-settings');
const timerDurationSelect = document.getElementById('timer-duration');
const shortBreakDurationSelect = document.getElementById('short-break-duration');
const longBreakDurationSelect = document.getElementById('long-break-duration');

// Show modal
settingsBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

// Save settings and update timer/break durations
saveSettingsBtn.addEventListener('click', () => {
  timerDuration = parseInt(timerDurationSelect.value) * 60;
  shortBreakDuration = parseInt(shortBreakDurationSelect.value) * 60;
  longBreakDuration = parseInt(longBreakDurationSelect.value) * 60;

  // Update the active mode based on current selection
  if (timerBtn.classList.contains('active')) {
    setMode(timerDuration, timerBtn);
  } else if (shortBreakBtn.classList.contains('active')) {
    setMode(shortBreakDuration, shortBreakBtn);
  } else if (longBreakBtn.classList.contains('active')) {
    setMode(longBreakDuration, longBreakBtn);
  }

  modal.style.display = 'none'; // Close modal after saving
});

// Close modal when clicking outside of the modal content
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
// also close modal when clicking x
const closeButton = document.querySelector(".close-btn");
closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});

// Ensure progress circle is fully displayed when the page loads
window.onload = () => {
  setProgress(100); // Ensure full circle is shown on initial load
  updateDisplay(); // Show the correct initial time
};

let selectedTheme = 'default'; // Temporary variable to store selected theme
const themeButtons = document.querySelectorAll('.theme-btn');
const applyButton = document.getElementById('save-settings');

// Function to apply the selected theme
function applyTheme(theme) {
  document.body.classList.remove('theme-default', 'theme-2', 'theme-3');
  document.body.classList.add(`theme-${theme}`);
}

// Event listener for each theme button to update selectedTheme
themeButtons.forEach(button => {
  button.addEventListener('click', () => {
    selectedTheme = button.dataset.theme; // Update temporary theme

    // Toggle active class
    themeButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});

// Apply theme only when the "Apply" button is clicked
applyButton.addEventListener('click', () => {
  localStorage.setItem('selectedTheme', selectedTheme); // Store theme
  applyTheme(selectedTheme); // Apply the stored theme
  modal.style.display = 'none'; // Close modal
});

// Load saved theme on page load
window.onload = () => {
  const savedTheme = localStorage.getItem('selectedTheme') || 'default';
  applyTheme(savedTheme);

  // Set active state on the correct theme button
  themeButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.theme === savedTheme);
  });
};
