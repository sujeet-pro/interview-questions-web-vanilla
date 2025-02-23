import { setupStopWatch } from "./render-utils";

// Write your app code here. init is called when the app is loaded.
export function init(rootElem: HTMLDivElement) {
  const {container, startButton, stopButton, resetButton, timerDisplay} = setupStopWatch()
  rootElem.classList.add('flex', 'justify-center', 'items-center')
  rootElem.replaceChildren(container)
  const stopWatch = new StopWatch(startButton, stopButton, resetButton, timerDisplay)
  stopWatch.reset()
}


class StopWatch {
  #startTime: number | null = null
  #isRunning = false
  #elapsedTime = 0
  #rafId: number | null = null

  #startButton: HTMLButtonElement
  #stopButton: HTMLButtonElement
  #resetButton: HTMLButtonElement
  #display: HTMLElement

  constructor(
    startButton: HTMLButtonElement, stopButton: HTMLButtonElement, resetButton: HTMLButtonElement, timerDisplay: HTMLElement
  ) {
    this.#startButton = startButton
    this.#stopButton = stopButton
    this.#resetButton = resetButton
    this.#display = timerDisplay

    this.#startButton.addEventListener('click', () => this.start())
    this.#stopButton.addEventListener('click', () => this.stop())
    this.#resetButton.addEventListener('click', () => this.reset())

    this.#startButton.disabled = false
    this.#stopButton.disabled = true
    this.#resetButton.disabled = true
  }

  #timerLoop() {
    this.#rafId = requestAnimationFrame(() => {
      if(!this.#isRunning) {
        return
      }
      const currentTime = Date.now()
      const elapsedTime = this.#elapsedTime + ( currentTime - (this.#startTime ?? currentTime))
      const ms = elapsedTime % 1000
      const seconds = Math.floor(elapsedTime / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(3, '0')}`
      this.#display.textContent = hours > 0 ? `${hours.toString().padStart(2, '0')}:${formattedTime}` : formattedTime
      this.#timerLoop()
    })
  }

  start() {
    if(this.#isRunning) return
    this.#startTime = Date.now()
    this.#isRunning = true
    this.#startButton.disabled = true
    this.#stopButton.disabled = false
    this.#resetButton.disabled = true
    this.#timerLoop()
  }

  stop() {
    if(!this.#isRunning) return
    this.#isRunning = false
    this.#elapsedTime += Date.now() - (this.#startTime ?? Date.now())
    this.#startTime = null
    this.#startButton.disabled = false
    this.#stopButton.disabled = true
    this.#resetButton.disabled = false
    if(this.#rafId != null) {
      cancelAnimationFrame(this.#rafId)
      this.#rafId = null
    }
  }

  reset() {
    this.#startTime = null
    this.#isRunning = false
    this.#elapsedTime = 0
    this.#display.textContent = '00:00:000'
    this.#startButton.disabled = false
    this.#stopButton.disabled = true
    this.#resetButton.disabled = true
  }
  
}

