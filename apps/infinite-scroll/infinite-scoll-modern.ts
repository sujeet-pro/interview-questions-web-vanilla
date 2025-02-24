export type DataFetcher<T> = {
  (): Promise<T>;
  hasNextPage(): boolean;
};

export type RenderFunction<T> = (data: T) => DocumentFragment;

export class InfiniteScrollContentModern<T> {
  #rootElement: HTMLElement;
  #dataFetcher: DataFetcher<T>;
  #renderFunction: RenderFunction<T>;
  #inProgress = false;
  #initialized = false;
  #observer: IntersectionObserver;
  #sentinel: HTMLElement;

  constructor(
    rootElement: HTMLElement,
    dataFetcher: DataFetcher<T>,
    renderFunction: RenderFunction<T>
  ) {
    this.#rootElement = rootElement;
    this.#dataFetcher = dataFetcher;
    this.#renderFunction = renderFunction;
    
    // Create a sentinel element that acts as a trigger point for loading more content
    // When this element becomes visible, it indicates we're near the bottom and should load more
    this.#sentinel = document.createElement('div');
    this.#sentinel.className = 'w-full bg-base-200 text-center p-4'
    this.#sentinel.textContent = 'Loading ...'
    
    this.#observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          this.askUpdate();
        }
      },
      {
        root: this.#rootElement,
        rootMargin: '100px',
        threshold: 0.1
      }
    );
  }

  #setupObserver() {
    this.#rootElement.appendChild(this.#sentinel);
    this.#observer.observe(this.#sentinel);
  }

  #removeObserver() {
    this.#observer.unobserve(this.#sentinel);
    this.#sentinel.remove();
  }

  async #renderContent(data: T) {
    return new Promise<void>((resolve) => {
      requestIdleCallback(() => {
        const renderedContent = this.#renderFunction(data);
        this.#rootElement.insertBefore(renderedContent, this.#sentinel);
        resolve();
      });
    });
  }

  async askUpdate() {
    try {
      if (!this.#initialized) {
        this.#initialized = true;
        this.#setupObserver();
      }
      if (this.#inProgress) {
        return;
      }

      this.#inProgress = true;
      const dataToRender = await this.#dataFetcher();
      await this.#renderContent(dataToRender);
      if (!this.#dataFetcher.hasNextPage()) {
        this.#removeObserver();
      }
      this.#inProgress = false;
    } catch (err) {
      this.#inProgress = false;
      console.error(err);
    }
  }

  destroy() {
    this.#removeObserver();
    this.#initialized = false;
    this.#inProgress = false;
  }
}
