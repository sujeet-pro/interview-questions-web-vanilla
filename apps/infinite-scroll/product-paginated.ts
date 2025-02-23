export type Product = {
    id: number
    title: string
    price: number
}

type ProductResponse = {
    products: Product[]
    total: number
    skip: number 
    limit: number
}

export class ProductPaginator {
    #currentSkip = 0;
    #totalProductCount: number | null = null;
    #limit: number;
    // #allProducts: Product[] = [];
    #hasMore = true;
    #currentRequest: Promise<Product[]> | null = null;

    constructor(limit: number) {
        this.#limit = limit;
    }

    async #getNextPage(): Promise<Product[]> {
        if (!this.#hasMore) {
            return [];
        }
        const response = await fetch(
            `https://dummyjson.com/products?limit=${this.#limit}&skip=${this.#currentSkip}&select=title,price`
        );
        const data = await response.json() as ProductResponse;
        
        if (this.#totalProductCount === null) {
            this.#totalProductCount = data.total;
        }

        const newProducts = data.products as Product[];
        // this.#allProducts.push(...newProducts);
        this.#currentSkip += this.#limit;
        this.#hasMore = this.#currentSkip < this.#totalProductCount;
        return newProducts
    }

    async getNextPage() {
        if (this.#currentRequest) {
            return this.#currentRequest;
        }
        this.#currentRequest = this.#getNextPage();
        const result = await this.#currentRequest;
        this.#currentRequest = null;
        return result;
    }

    reset() {
        this.#currentSkip = 0;
        this.#totalProductCount = null;
        // this.#allProducts = [];
        this.#hasMore = true;
    }

    get hasMore() {
        return this.#hasMore;
    }

    get inProgress() {
        return this.#currentRequest !== null;
    }

    // getAllProducts(): Product[] {
    //     return [...this.#allProducts];
    // }
}
