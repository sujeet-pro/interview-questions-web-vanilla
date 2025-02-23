import { InfiniteScrollContent } from "./infinite-scoll-core"
import { createProductPaginator, ProductResponse } from "./product-paginated"
import { getSetupHTML, renderProductList } from "./product-render"

// Write your app code here. init is called when the app is loaded.
export function init(rootElem: HTMLDivElement) {
  rootElem.classList.add('flex', 'justify-center', 'items-center')
  rootElem.innerHTML = getSetupHTML()

  const productListContainer = rootElem.querySelector<HTMLUListElement>('#product-list')
  if (!productListContainer) {
    throw new Error('Product list not found')
  }
  
  const infiniteScrollContent = new InfiniteScrollContent<ProductResponse>(
    productListContainer,
    createProductPaginator(10),
    (data) => renderProductList(data.products)
  )
  
  infiniteScrollContent.askUpdate()
}


