export type DataFetcher<T> = {
  (): Promise<T>;
  hasNextPage(): boolean;
};

export type RenderFunction<T> = (data: T) => DocumentFragment;

function debounce(fn: () => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(fn, delay);
  };
}

export class InfiniteScrollContent<T> {
  #rootElement: HTMLElement;
  #dataFetcher: DataFetcher<T>;
  #renderFunction: RenderFunction<T>;
  #inProgress = false;
  #initialized = false;
  #boundScrollHandler: () => void;

  constructor(
    rootElement: HTMLElement,
    dataFetcher: DataFetcher<T>,
    renderFunction: RenderFunction<T>
  ) {
    this.#rootElement = rootElement;
    this.#dataFetcher = dataFetcher;
    this.#renderFunction = renderFunction;
    this.#boundScrollHandler = debounce(this.#scrollHandler.bind(this), 100);
  }

  #scrollHandler() {
    const triggerThreshold = 0.2 * this.#rootElement.clientHeight;
    const scrollOffset = this.#rootElement.scrollTop + this.#rootElement.clientHeight + triggerThreshold
    console.log(`${scrollOffset} >= ${this.#rootElement.scrollHeight}`)
    if (
       scrollOffset >= this.#rootElement.scrollHeight
    ) {
      this.askUpdate();
    }
  }

  #setupScrollListener() {
    this.#rootElement.addEventListener("scroll", this.#boundScrollHandler);
  }
  #removeScrollListener() {
    this.#rootElement.removeEventListener("scroll", this.#boundScrollHandler);
  }

  async #renderContent(data: T) {
    return new Promise<void>((resolve) => {
      requestIdleCallback(() => {
        const renderedContent = this.#renderFunction(data);
        this.#rootElement.appendChild(renderedContent);
        resolve();
      });
    });
  }

  async askUpdate() {
    try {
      if (!this.#initialized) {
        this.#initialized = true;
        this.#setupScrollListener();
      }
      if (this.#inProgress) {
        return;
      }

      this.#inProgress = true;
      const dataToRender = await this.#dataFetcher();
      await this.#renderContent(dataToRender);
      if (!this.#dataFetcher.hasNextPage()) {
        this.#removeScrollListener();
      }
      this.#inProgress = false;
    } catch (err) {
      this.#inProgress = false;
      console.error(err);
    }
  }

  destroy() {
    this.#removeScrollListener();
    this.#initialized = false;
    this.#inProgress = false;
  }
}
