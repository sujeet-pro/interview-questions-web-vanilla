// Write your app code here. init is called when the app is loaded.
export function init(rootElem: HTMLDivElement) {
  rootElem.innerHTML = `
    <div class="p-4 flex flex-col gap-4">
      <h2 id="current-value">0</h2>
      <div>
        <button data-action="+" class="btn">Increment</button>
        <button data-action="-" class="btn">Decrement</button>
        <button data-action="0" class="btn">Reset</button>
      </div>
      <div>
        <label for="increment-by">Increment By</label>
        <input id="increment-by" type="number" step="1" value="1" min="1" />
      </div>
    </div>
  `
  const currentValueElem =
    document.querySelector<HTMLHeadingElement>("#current-value")!;
  const incrementByInputElem =
    document.querySelector<HTMLInputElement>("#increment-by")!;
  
  let incrementByValue = Number(incrementByInputElem.value);
  let currentValue = 0;
  
  incrementByInputElem.addEventListener("change", () => {
    incrementByValue = Number(incrementByInputElem.value);
  });
  
  rootElem.addEventListener("click", e => {
    const target = e.target;
    if (!(target instanceof Element)) {
      return null;
    }
    const action = target.getAttribute("data-action");
    if (action === "+") {
      currentValue += incrementByValue;
    } else if (action === "-") {
      currentValue -= incrementByValue;
    } else if (action === "0") {
      currentValue = 0;
      incrementByValue = 1;
      incrementByInputElem.value = "1";
    }
    currentValueElem.textContent = String(currentValue);
  });
  
}