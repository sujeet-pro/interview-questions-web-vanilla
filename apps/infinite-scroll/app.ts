import { getSetupHTML } from "./product-render"
import { ProductUpdateList } from "./product-update-list"

// Write your app code here. init is called when the app is loaded.
export function init(rootElem: HTMLDivElement) {
  rootElem.classList.add('flex', 'justify-center', 'items-center')
  rootElem.innerHTML = getSetupHTML()

  const productList = rootElem.querySelector<HTMLUListElement>('#product-list')
  if (!productList) {
    throw new Error('Product list not found')
  }
  
  const productUpdateList = new ProductUpdateList(productList);
  productUpdateList.askUpdate();

}


