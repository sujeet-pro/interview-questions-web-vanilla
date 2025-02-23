import { Product, ProductPaginator } from "./product-paginated";
import { renderProductList } from "./product-render";

export class ProductUpdateList {
    #productListRootElement: HTMLElement;
    #productPaginator: ProductPaginator;
    #inProgress = false;
    #initialized = false;

    constructor(productListRootElement: HTMLElement) {
        this.#productListRootElement = productListRootElement;
        this.#productPaginator = new ProductPaginator(10);
    }

    #setupScrollListener() {
        const triggerThreshold = 0.2 * this.#productListRootElement.clientHeight
        const scrollHandler = () => {
            
            if(this.#productListRootElement.scrollTop + this.#productListRootElement.clientHeight + triggerThreshold>= this.#productListRootElement.scrollHeight) {
                this.askUpdate();
                if (!this.#productPaginator.hasMore) {
                    this.#productListRootElement.removeEventListener('scroll', scrollHandler);
                }
            }
        };
        
        this.#productListRootElement.addEventListener('scroll', scrollHandler);
    }


    async #renderProducts(products: Product[]) {
        return new Promise<void>(resolve => {
            requestIdleCallback(() => {
                const newProductItems = renderProductList(products);
                this.#productListRootElement.appendChild(newProductItems);
                resolve();
            });
        });
    }

    async #updateList() {
        try {
            this.#inProgress = true;
            const products = await this.#productPaginator.getNextPage();
            await this.#renderProducts(products);
        } catch (error) {
            console.error(error);
        } finally {
            this.#inProgress = false;
        }
    }
    
    async askUpdate() {
        if(!this.#initialized) {
            this.#initialized = true;
            this.#setupScrollListener();
        }
        if(this.#inProgress) {
            return;
        }
        await this.#updateList();
    }
}