import { Product } from "./product-paginated"


/**
 * Renders a product item as an li element with the following structure:
 * 
 * Visual Layout:
 * +--------------------------------+
 * | #123  Product Title           |
 * |       $99.99                  |
 * +--------------------------------+
 * 
 * Generated HTML:
 * <li class="border-b p-2 flex flex-row">
 *     <span class="text-sm text-gray-500 w-12">#123</span>
 *     <div class="flex-grow flex flex-col">
 *       <span class="text-sm text-gray-600 mt-1 pl-12">$99.99</span>
 *       <span class="flex-1">Product Title</span>
 *     </div>
 * </li>
 * 
 * @param product - The product object containing id, title and price
 * @returns HTMLLIElement - The rendered list item element
 */
function renderProductItem(product: Product) {
    const li = document.createElement('li')
    li.classList.add('border-b', 'p-2', 'flex', 'flex-row')
    
    const idSpan = document.createElement('span')
    idSpan.classList.add('text-sm', 'text-gray-500', 'w-12')
    idSpan.textContent = `#${product.id}`
    
    const contentDiv = document.createElement('div')
    contentDiv.classList.add('flex-grow', 'flex', 'flex-col')
    
    const priceSpan = document.createElement('span')
    priceSpan.classList.add('text-sm', 'text-gray-600', 'mt-1', 'pl-12')
    priceSpan.textContent = `$${product.price.toFixed(2)}`
    
    const titleSpan = document.createElement('span')
    titleSpan.classList.add('flex-1')
    titleSpan.textContent = product.title
    
    contentDiv.appendChild(titleSpan)
    contentDiv.appendChild(priceSpan)
    
    li.appendChild(idSpan)
    li.appendChild(contentDiv)
    
    return li
}


export function renderProductList(products: Product[]) {
    const documentFragment = document.createDocumentFragment()
    products.forEach(product => {
        const li = renderProductItem(product)
        documentFragment.appendChild(li)
    })
    return documentFragment
}


/**
 * Returns the HTML structure for the product list section
 * @returns {string} HTML string containing:
 * <section>
 *   <h2 class="text-2xl font-bold">Product List</h2>
 *   <ul class="h-60 w-60 border" id="product-list"></ul>
 * </section>
 */
export function getSetupHTML() {
  const section = document.createElement('section')
  
  const heading = document.createElement('h2')
  heading.classList.add('text-2xl', 'font-bold')
  heading.textContent = 'Product List'
  
  const list = document.createElement('ul')
  list.classList.add('h-60', 'w-60', 'border', 'overflow-y-auto')
  list.id = 'product-list'
  
  section.appendChild(heading)
  section.appendChild(list)
  
  return section.outerHTML
}