export function setupTypeahead() {
  const typeaheadContainer = document.createElement("div");
  typeaheadContainer.className = "flex flex-col gap-2 w-full p-4";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Search...";
  input.className = "input mx-auto inline-block w-100";
  
  const suggestionsList = document.createElement("ul");
  suggestionsList.className = "flex flex-col gap-2 w-100 p-4 mx-auto";
  suggestionsList.setAttribute("role", "listbox");

  typeaheadContainer.appendChild(input);
  typeaheadContainer.appendChild(suggestionsList);
  return {typeahead: typeaheadContainer, input, suggestionsList};
}

export function renderSuggestions(container: HTMLElement, suggestions: {title: string}[]) {
    const fragment = document.createDocumentFragment();
    suggestions.forEach((suggestion, index) => {
        const li = document.createElement("li");
        li.textContent = suggestion.title;
        li.setAttribute("role", "option");
        li.setAttribute("tabindex", "0");
        li.className = 'cursor-pointer btn btn-block btn-ghost justify-start';
        li.dataset.index = index.toString();
        fragment.appendChild(li);
    });

    container.replaceChildren(fragment);
}