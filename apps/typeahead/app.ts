import { renderSuggestions, setupTypeahead } from "./render";

// Write your app code here. init is called when the app is loaded.
export function init(rootElem: HTMLDivElement) {
  const {typeahead, input, suggestionsList} = setupTypeahead();
  rootElem.replaceChildren(typeahead);

  const handler = debounce(e => {
    updateSuggestions(suggestionsList, (e.target as HTMLInputElement).value);
  }, 300)
  input.addEventListener("input", handler);

  const selectItem = (target: HTMLElement) => {
    if (target.tagName === "LI") {
      input.value = target.textContent ?? "";
      suggestionsList.replaceChildren();
    }
  };

  suggestionsList.addEventListener("click", (e) => {
    selectItem(e.target as HTMLElement);
  });

  suggestionsList.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      selectItem(e.target as HTMLElement);
    }
  });
}

function debounce(fn: (...args: any[]) => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: any[]) => {
    if(timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => fn(...args), delay);
  };
}

async function fetchSuggestions(query: string, signal: AbortSignal) {
  const res = await fetch(`https://dummyjson.com/products/search?q=${query}`, {signal});
  const data = await res.json();
  return data.products;
}

let controller: AbortController | null = null;
async function updateSuggestions(suggestionsList: HTMLElement, query: string) {
  if(controller) {
    controller.abort();
  }
  suggestionsList.replaceChildren("Loading...");
  controller = new AbortController();
  const suggestions = await fetchSuggestions(query, controller.signal);
  renderSuggestions(suggestionsList, suggestions);
}