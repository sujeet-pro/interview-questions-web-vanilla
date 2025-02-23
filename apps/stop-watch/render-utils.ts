
/**
 * Creates and returns a stop watch interface with the following structure:
 * ```html
 * <div class="flex flex-col items-center gap-4">
 *   <h1 class="text-2xl">Stop Watch</h1>
 *   <div role="timer" class="text-4xl font-mono">00:00:000</div>
 *   <div class="button-container flex justify-center gap-2">
 *     <button id="start-button" class="btn">Start</button>
 *     <button id="stop-button" class="btn">Stop</button>
 *     <button id="reset-button" class="btn">Reset</button>
 *   </div>
 * </div>
 * ```
 */
export function setupStopWatch() {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center gap-4';

  const heading = document.createElement('h1');
  heading.textContent = 'Stop Watch';
  heading.className = 'text-2xl'
  container.appendChild(heading);

  const timerDisplay = document.createElement('div');
  timerDisplay.setAttribute('role', 'timer');
  timerDisplay.textContent = '00:00:000';
  timerDisplay.className = 'text-4xl font-mono'
  container.appendChild(timerDisplay);

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container flex justify-center gap-2';

  const startButton = document.createElement('button');
  startButton.id = 'start-button';
  startButton.textContent = 'Start';
  startButton.className = 'btn'
  buttonContainer.appendChild(startButton);

  const stopButton = document.createElement('button');
  stopButton.id = 'stop-button';
  stopButton.textContent = 'Stop';
  stopButton.className = 'btn'
  buttonContainer.appendChild(stopButton);

  const resetButton = document.createElement('button');
  resetButton.id = 'reset-button';
  resetButton.textContent = 'Reset';
  resetButton.className = 'btn'
  buttonContainer.appendChild(resetButton);

  container.appendChild(buttonContainer);

  return {container, startButton, stopButton, resetButton, timerDisplay};
}