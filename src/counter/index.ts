const appElem = document.querySelector<HTMLDivElement>("#app")!;
const currentValueElem =
  document.querySelector<HTMLHeadingElement>("#current-value")!;
const incrementByInputElem =
  document.querySelector<HTMLInputElement>("#increment-by")!;

let incrementByValue = Number(incrementByInputElem.value);
let currentValue = 0;

incrementByInputElem.addEventListener("change", () => {
  incrementByValue = Number(incrementByInputElem.value);
});

appElem.addEventListener("click", e => {
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
