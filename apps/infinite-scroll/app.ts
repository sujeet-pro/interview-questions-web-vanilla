import { InfiniteScrollContent } from "./infinite-scoll-core"
import { InfiniteScrollContentModern } from "./infinite-scoll-modern"
import { createProductPaginator, ProductResponse } from "./product-paginated"
import { getSetupHTML, renderProductList } from "./product-render"

// Write your app code here. init is called when the app is loaded.
export function init(rootElem: HTMLDivElement) {
  rootElem.classList.add('flex', 'justify-center', 'items-center', 'p-4')
  const {container, list1, list2} = getSetupHTML()
  rootElem.replaceChildren(container)

  const infiniteScrollContent = new InfiniteScrollContent<ProductResponse>(
    list1,
    createProductPaginator(10),
    (data) => renderProductList(data.products)
  )
  const infiniteScrollContentModern = new InfiniteScrollContentModern(
    list2,
    createProductPaginator(10),
    (data) => renderProductList(data.products)
  )
  
  infiniteScrollContent.askUpdate()
  infiniteScrollContentModern.askUpdate()
}


